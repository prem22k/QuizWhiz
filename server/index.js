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

// ─── Gmail API Sender (OAuth2 — NO SMTP/nodemailer) ─────────────────
const sendGmail = async ({ to, subject, text, html }) => {
    if (!hasOAuthCreds || !GMAIL_USER) return null;

    try {
        const oAuth2Client = new google.auth.OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );
        oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

        const accessTokenResponse = await oAuth2Client.getAccessToken();
        if (!accessTokenResponse?.token) return null;

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

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to send via Gmail API:', error.message);
        return { success: false, error };
    }
};

// ─── Sheets Client (Service Account) ────────────────────────────────
const getSheetsClient = () => {
    if (!hasServiceAccountCreds) return null;

    try {
        let privateKey = GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }
        if (privateKey.startsWith("'") && privateKey.endsWith("'")) {
            privateKey = privateKey.slice(1, -1);
        }
        privateKey = privateKey.replace(/\\n/g, '\n');

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: privateKey,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({ version: 'v4', auth });
    } catch (error) {
        console.error('Failed to create Sheets client:', error.message);
        return null;
    }
};

// ─── Template Reader ─────────────────────────────────────────────────
const readTemplate = (templateName) => {
    try {
        const templatePath = path.join(__dirname, '..', 'emails', `${templateName}.html`);
        return fs.readFileSync(templatePath, 'utf8');
    } catch (error) {
        console.error(`Failed to read template ${templateName}:`, error.message);
        return null;
    }
};

// ─── Routes ──────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'QuizWhiz backend is running' });
});

app.post('/send-otp', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'Missing email or code' });
    }

    let htmlContent = readTemplate('otp');
    if (htmlContent) {
        htmlContent = htmlContent.replace('{{OTP_CODE}}', code);
    } else {
        htmlContent = `<p>Your verification code is: <strong>${code}</strong></p>`;
    }

    try {
        const result = await sendGmail({
            to: email,
            subject: 'Your Verification Code',
            text: `Your verification code is: ${code}`,
            html: htmlContent,
        });
        if (!result) return res.json({ success: true, warning: 'Email mocked (missing credentials)' });
        if (!result.success) return res.status(500).json({ error: 'Failed to send email' });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to send OTP:', error.message);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/send-welcome', async (req, res) => {
    const { email, name } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }

    let htmlContent = readTemplate('welcome');
    if (htmlContent) {
        htmlContent = htmlContent.replace('{{USER_NAME}}', name || 'Agent');
    } else {
        htmlContent = `<h3>Welcome to QuizWhiz, ${name || 'Agent'}!</h3><p>Get ready for the ultimate cyberpunk quiz experience.</p>`;
    }

    try {
        const result = await sendGmail({
            to: email,
            subject: 'Welcome to QuizWhiz!',
            text: `Hi ${name || 'there'},\n\nWelcome to QuizWhiz! We are excited to have you on board.`,
            html: htmlContent,
        });
        if (!result) return res.json({ success: true, warning: 'Email mocked (missing credentials)' });
        if (!result.success) return res.status(500).json({ error: 'Failed to send email' });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to send Welcome Email:', error.message);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

app.post('/log-user', async (req, res) => {
    const { name, email, phone } = req.body;

    // Admin notification (fire and forget)
    const adminEmail = process.env.ADMIN_EMAIL || 'consolemaster.app@gmail.com';
    let adminHtml = readTemplate('newUser');
    if (adminHtml) {
        adminHtml = adminHtml
            .replace(/{{USER_NAME}}/g, name)
            .replace(/{{USER_EMAIL}}/g, email)
            .replace(/{{SIGNUP_TIMESTAMP}}/g, new Date().toLocaleString())
            .replace(/{{USER_ID}}/g, Math.random().toString(36).substr(2, 9).toUpperCase());
    } else {
        adminHtml = `<p>New User Signed Up:<br>Name: ${name}<br>Email: ${email}</p>`;
    }

    sendGmail({
        to: adminEmail,
        subject: 'New User Signed Up',
        html: adminHtml,
        text: `New User Signed Up: ${name} (${email})`
    }).catch(() => { });

    // Log to Google Sheets
    if (!GOOGLE_SHEET_ID) {
        return res.json({ success: true, warning: 'Sheet ID not configured' });
    }

    const sheets = getSheetsClient();
    if (!sheets) {
        return res.json({ success: true, warning: 'Service Account credentials missing' });
    }

    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: GOOGLE_SHEET_ID,
            range: 'Sheet1!A:D',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[name, email, phone || 'N/A', new Date().toLocaleString()]],
            },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Failed to log user to Sheet:', error.message);
        res.json({ success: true, warning: 'Logging failed silently' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
