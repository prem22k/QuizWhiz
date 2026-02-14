import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import express from 'express';
import cors from 'cors';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

// ─── Shared OAuth2 Config ────────────────────────────────────────────
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;
const GMAIL_USER = process.env.GMAIL_USER_EMAIL;

// ─── Sheets Config ──────────────────────────────────────────────────
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

const hasOAuthCreds = !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN);
const hasServiceAccountCreds = !!(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY);

console.log('─── Environment Check ───');
console.log(`  GMAIL_CLIENT_ID: ${GMAIL_CLIENT_ID ? '✅ set (' + GMAIL_CLIENT_ID.substring(0, 10) + '...)' : '❌ missing'}`);
console.log(`  GMAIL_CLIENT_SECRET: ${GMAIL_CLIENT_SECRET ? '✅ set' : '❌ missing'}`);
console.log(`  GMAIL_REFRESH_TOKEN: ${GMAIL_REFRESH_TOKEN ? '✅ set (' + GMAIL_REFRESH_TOKEN.substring(0, 10) + '...)' : '❌ missing'}`);
console.log(`  GMAIL_USER_EMAIL: ${GMAIL_USER || '❌ missing'}`);
console.log(`  GOOGLE_SHEET_ID: ${GOOGLE_SHEET_ID || '❌ missing'}`);
console.log(`  GOOGLE_SERVICE_ACCOUNT_EMAIL: ${GOOGLE_SERVICE_ACCOUNT_EMAIL || '❌ missing'}`);
console.log(`  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: ${GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? '✅ set (' + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.substring(0, 30) + '...)' : '❌ missing'}`);
console.log(`  ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || '(using default: consolemaster.app@gmail.com)'}`);
console.log(`  hasOAuthCreds: ${hasOAuthCreds}`);
console.log(`  hasServiceAccountCreds: ${hasServiceAccountCreds}`);
console.log('─────────────────────────');

if (!hasOAuthCreds) {
    console.warn('⚠️  Missing OAuth2 credentials. Email sending will be mocked.');
}
if (!hasServiceAccountCreds) {
    console.warn('⚠️  Missing Service Account credentials. Sheet logging will be mocked.');
}

// ─── Gmail API Sender (OAuth2 refresh token — NO SMTP/nodemailer) ───
const sendGmail = async ({ to, subject, text, html }) => {
    console.log(`📧 [sendGmail] START — to: ${to}, subject: "${subject}"`);

    if (!hasOAuthCreds || !GMAIL_USER) {
        console.warn('📧 [sendGmail] SKIP — Missing OAuth2 credentials. Email will be mocked.');
        return null;
    }

    try {
        console.log('📧 [sendGmail] Step 1: Creating OAuth2 client...');
        const oAuth2Client = new google.auth.OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );
        oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
        console.log('📧 [sendGmail] Step 1: ✅ OAuth2 client created');

        console.log('📧 [sendGmail] Step 2: Getting access token...');
        const accessTokenResponse = await oAuth2Client.getAccessToken();
        const accessToken = accessTokenResponse?.token;
        if (!accessToken) {
            console.error('📧 [sendGmail] Step 2: ❌ Failed to obtain access token');
            return null;
        }
        console.log('📧 [sendGmail] Step 2: ✅ Access token obtained');

        console.log('📧 [sendGmail] Step 3: Building MIME message...');
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });
        const mimeMessage = [
            `From: QuizWhiz <${GMAIL_USER}>`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html || text || '',
        ].join('\r\n');

        const raw = Buffer.from(mimeMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/g, '');
        console.log(`📧 [sendGmail] Step 3: ✅ MIME message built (${raw.length} chars base64)`);

        console.log('📧 [sendGmail] Step 4: Sending via Gmail API...');
        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
        console.log(`📧 [sendGmail] Step 4: ✅ Email sent successfully to ${to}`);

        return { success: true };
    } catch (error) {
        console.error(`📧 [sendGmail] ❌ FAILED:`, error.message || error);
        return { success: false, error };
    }
};

// ─── Sheets Client (Service Account) ────────────────────────────────
const getSheetsClient = () => {
    console.log('📊 [getSheetsClient] START');

    if (!hasServiceAccountCreds) {
        console.warn('📊 [getSheetsClient] SKIP — Missing Service Account credentials');
        return null;
    }

    try {
        console.log('📊 [getSheetsClient] Step 1: Sanitizing private key...');
        let privateKey = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

        // Remove wrapping quotes if present
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
            console.log('📊 [getSheetsClient] Step 1a: Removed wrapping quotes');
        }
        if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
            privateKey = privateKey.slice(1, -1);
            console.log('📊 [getSheetsClient] Step 1b: Removed wrapping single quotes');
        }

        // Replace literal \n with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
        console.log(`📊 [getSheetsClient] Step 1c: Key starts with: "${privateKey.substring(0, 30)}..."`);
        console.log(`📊 [getSheetsClient] Step 1c: Key ends with: "...${privateKey.substring(privateKey.length - 30)}"`);
        console.log(`📊 [getSheetsClient] Step 1c: Key length: ${privateKey.length} chars`);
        console.log(`📊 [getSheetsClient] Step 1c: Contains newlines: ${privateKey.includes('\n')}`);
        console.log(`📊 [getSheetsClient] Step 1c: Newline count: ${(privateKey.match(/\n/g) || []).length}`);

        console.log('📊 [getSheetsClient] Step 2: Creating GoogleAuth client...');
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        console.log('📊 [getSheetsClient] Step 2: ✅ GoogleAuth client created');

        console.log('📊 [getSheetsClient] Step 3: Creating Sheets client...');
        const sheets = google.sheets({ version: 'v4', auth });
        console.log('📊 [getSheetsClient] Step 3: ✅ Sheets client created');

        return sheets;
    } catch (error) {
        console.error('📊 [getSheetsClient] ❌ FAILED:', error.message || error);
        return null;
    }
};

// ─── Template Reader ─────────────────────────────────────────────────
const readTemplate = (templateName) => {
    const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
    console.log(`📄 [readTemplate] Reading: ${templatePath}`);
    try {
        const content = fs.readFileSync(templatePath, 'utf8');
        console.log(`📄 [readTemplate] ✅ Template "${templateName}" loaded (${content.length} chars)`);
        return content;
    } catch (error) {
        console.error(`📄 [readTemplate] ❌ Failed to read "${templateName}":`, error.message);
        return null;
    }
};

// ─── Routes ──────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    console.log('🏠 [GET /] Health check');
    res.json({ status: 'ok', message: 'QuizWhiz backend is running', timestamp: new Date().toISOString() });
});

app.post('/send-otp', async (req, res) => {
    const { email, code } = req.body;
    console.log(`\n🔐 [POST /send-otp] START — email: ${email}, code: ${code}`);

    if (!email || !code) {
        console.log('🔐 [POST /send-otp] ❌ Missing email or code');
        return res.status(400).json({ error: 'Missing email or code' });
    }

    console.log('🔐 [POST /send-otp] Step 1: Reading OTP template...');
    let htmlContent = readTemplate('otp');
    if (htmlContent) {
        htmlContent = htmlContent.replace('{{OTP_CODE}}', code);
        console.log('🔐 [POST /send-otp] Step 1: ✅ Template loaded and placeholder replaced');
    } else {
        htmlContent = `<p>Your verification code is: <strong>${code}</strong></p>`;
        console.log('🔐 [POST /send-otp] Step 1: ⚠️ Using fallback HTML');
    }

    try {
        console.log('🔐 [POST /send-otp] Step 2: Calling sendGmail...');
        const result = await sendGmail({
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
            html: htmlContent,
        });

        if (!result) {
            console.log(`🔐 [POST /send-otp] Step 2: ⚠️ Email mocked (no credentials)`);
            return res.json({ success: true, warning: 'Email mocked (missing credentials)' });
        }
        if (!result.success) {
            console.log('🔐 [POST /send-otp] Step 2: ❌ sendGmail returned failure');
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log(`🔐 [POST /send-otp] ✅ COMPLETE — OTP sent to ${email}`);
        res.json({ success: true });
    } catch (error) {
        console.error('🔐 [POST /send-otp] ❌ EXCEPTION:', error.message || error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/send-welcome', async (req, res) => {
    const { email, name } = req.body;
    console.log(`\n🎉 [POST /send-welcome] START — email: ${email}, name: ${name}`);

    if (!email) {
        console.log('🎉 [POST /send-welcome] ❌ Missing email');
        return res.status(400).json({ error: 'Missing email' });
    }

    console.log('🎉 [POST /send-welcome] Step 1: Reading welcome template...');
    let htmlContent = readTemplate('welcome');
    if (htmlContent) {
        htmlContent = htmlContent.replace('{{USER_NAME}}', name || 'Agent');
        console.log('🎉 [POST /send-welcome] Step 1: ✅ Template loaded');
    } else {
        htmlContent = `<h3>Welcome to QuizWhiz, ${name || 'Agent'}!</h3><p>Get ready for the ultimate cyberpunk quiz experience.</p>`;
        console.log('🎉 [POST /send-welcome] Step 1: ⚠️ Using fallback HTML');
    }

    try {
        console.log('🎉 [POST /send-welcome] Step 2: Calling sendGmail...');
        const result = await sendGmail({
            to: email,
            subject: 'Welcome to QuizWhiz!',
            text: `Hi ${name || 'there'},\n\nWelcome to QuizWhiz! We are excited to have you on board.`,
            html: htmlContent,
        });

        if (!result) {
            console.log(`🎉 [POST /send-welcome] Step 2: ⚠️ Email mocked`);
            return res.json({ success: true, warning: 'Email mocked (missing credentials)' });
        }
        if (!result.success) {
            console.log('🎉 [POST /send-welcome] Step 2: ❌ sendGmail returned failure');
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log(`🎉 [POST /send-welcome] ✅ COMPLETE — Welcome email sent to ${email}`);
        res.json({ success: true });
    } catch (error) {
        console.error('🎉 [POST /send-welcome] ❌ EXCEPTION:', error.message || error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/log-user', async (req, res) => {
    const { name, email, phone } = req.body;
    console.log(`\n👤 [POST /log-user] START — name: ${name}, email: ${email}, phone: ${phone || 'N/A'}`);

    // --- Step 1: Admin email notification ---
    const adminEmail = process.env.ADMIN_EMAIL || 'consolemaster.app@gmail.com';
    console.log(`👤 [POST /log-user] Step 1: Sending admin notification to ${adminEmail}...`);

    let adminHtml = readTemplate('newUser');
    if (adminHtml) {
        adminHtml = adminHtml
            .replace(/{{USER_NAME}}/g, name)
            .replace(/{{USER_EMAIL}}/g, email)
            .replace(/{{SIGNUP_TIMESTAMP}}/g, new Date().toLocaleString())
            .replace(/{{USER_ID}}/g, Math.random().toString(36).substr(2, 9).toUpperCase());
        console.log('👤 [POST /log-user] Step 1a: ✅ Admin template loaded and placeholders replaced');
    } else {
        adminHtml = `<p>New User Signed Up:<br>Name: ${name}<br>Email: ${email}</p>`;
        console.log('👤 [POST /log-user] Step 1a: ⚠️ Using fallback admin HTML');
    }

    // Fire and forget (don't await — don't block the response)
    sendGmail({
        to: adminEmail,
        subject: 'New User Signed Up',
        html: adminHtml,
        text: `New User Signed Up: ${name} (${email})`
    }).then(result => {
        if (result?.success) console.log(`👤 [POST /log-user] Step 1b: ✅ Admin notification sent to ${adminEmail}`);
        else console.error(`👤 [POST /log-user] Step 1b: ❌ Admin notification failed:`, result?.error?.message || result?.error);
    }).catch(err => {
        console.error(`👤 [POST /log-user] Step 1b: ❌ Admin notification exception:`, err.message);
    });

    // --- Step 2: Log to Google Sheets ---
    console.log('👤 [POST /log-user] Step 2: Checking Sheet credentials...');

    if (!GOOGLE_SHEET_ID) {
        console.warn('👤 [POST /log-user] Step 2: ⚠️ Missing GOOGLE_SHEET_ID');
        console.log(`[NEW USER] Name: ${name}, Email: ${email}`);
        return res.json({ success: true, warning: 'Sheet ID not configured' });
    }

    console.log('👤 [POST /log-user] Step 2a: Creating Sheets client...');
    const sheets = getSheetsClient();
    if (!sheets) {
        console.warn('👤 [POST /log-user] Step 2a: ⚠️ Sheets client creation failed');
        console.log(`[NEW USER] Name: ${name}, Email: ${email}`);
        return res.json({ success: true, warning: 'Service Account credentials missing' });
    }
    console.log('👤 [POST /log-user] Step 2a: ✅ Sheets client ready');

    try {
        console.log('👤 [POST /log-user] Step 2b: Appending row to sheet...');
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[name, email, phone || 'N/A', new Date().toLocaleString()]],
            },
        });
        console.log(`👤 [POST /log-user] Step 2b: ✅ User logged to Sheet: ${email}`);
        console.log(`👤 [POST /log-user] ✅ COMPLETE`);
        res.json({ success: true });
    } catch (error) {
        console.error('👤 [POST /log-user] Step 2b: ❌ Sheet append FAILED:', error.message || error);
        res.json({ success: true, warning: 'Logging failed silently' });
    }
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`  OAuth2 credentials: ${hasOAuthCreds ? '✅ loaded' : '❌ missing'}`);
    console.log(`  Service Account credentials: ${hasServiceAccountCreds ? '✅ loaded' : '❌ missing'}`);
    console.log(`  Gmail user: ${GMAIL_USER || '❌ not set'}`);
    console.log(`  Google Sheet ID: ${GOOGLE_SHEET_ID || '❌ not set'}`);
    console.log(`  Admin email: ${process.env.ADMIN_EMAIL || 'consolemaster.app@gmail.com (default)'}`);
    console.log(`  Node version: ${process.version}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('  ⚠️  This server uses Gmail API (googleapis) — NOT nodemailer/SMTP');
});
