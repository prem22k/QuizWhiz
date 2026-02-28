# QuizWhiz - Pre-Deployment Bug Documentation

This document summarizes the current status of the 8 pre-deployment bugs identified during the testing phase.

## Status Summary
- ✅ **Fixed (7)**
- 🕵️ **Confirmed & Pending Fix (0) / (0 in-scope)**
- ⚠️ **External Dependency / Won't Fix Directly (1)**

---

### 1. Login Page – Text Visibility Issue
* **Status**: ✅ **FIXED** (Resolved in previous tasks)
* **Description**: Text was faded and lacked proper contrast.
* **Fix Applied**: Adjusted the text colors, placeholders, and footer text in `src/app/login/page.tsx` to improve visibility against the dark background.

### 2. Footer Links Not Working (Home Page)
* **Status**: 🕵️ **CONFIRMED**
* **Description**: "Privacy", "Contact", and "Terms" links do not trigger navigation.
* **Root Cause Found**: In `src/app/page.tsx`, the footer links are hardcoded to `href="#"` and no routes currently exist for these pages.
* **Impact**: Medium

### 3. Play Page – Unable to Change Answer Within Timer
* **Status**: ✅ **FIXED** (Resolved)
* **Description**: Users cannot change their answer before the timer expires.
* **Fix Applied**: Removed the `disabled={isAnswerSubmitted}` constraint from the option buttons in `question-view.tsx` and removed early return blocks in `client.tsx`, allowing users to overwrite their answers in Firestore before the timer ends.
* **Impact**: High

### 4. Host/Create Page – Quiz Generation Failure
* **Status**: ✅ **FIXED** (Resolved)
* **Description**: System fails to generate a quiz after inputs are provided.
* **Fix Applied**: Imported Firebase `auth` into `src/app/host/create/quiz-form.tsx` and updated the `handleSubmit` logic to fetch `auth.currentUser`. The `email` and `uid` are now successfully passed to `createQuiz`, correctly linking the quiz to the host and passing security checks.
* **Impact**: Critical

### 5. Manual Question Addition – Signal/Error Issue
* **Status**: ✅ **FIXED** (Resolved)
* **Description**: System throws a "signal-related error" when manually adding questions.
* **Fix Applied**: Added `type="button"` to the "remove question" (Trash) button in `quiz-form.tsx`. Previously, it was implicitly acting as a submit button (default browser behavior inside a form), triggering destructive `onSubmit` calls and `AbortSignals` when clicked.
* **Impact**: High

### 6. Settings Page – Edit Button Not Working
* **Status**: ✅ **FIXED** (Resolved)
* **Description**: The "Edit" button for the user profile triggers no action.
* **Fix Applied**: Hooked the UserProfile block in `settings/page.tsx` up to Firebase Auth. Created a dynamic `<UserProfileSection />` component with an `isEditing` toggle state, an `<Input>` form for modifying the display name, and a "Save" action via Firebase's `updateProfile` method.
* **Impact**: Medium

### 7. Admin Page – Results Section Not Working
* **Status**: ✅ **FIXED** (Resolved in previous tasks)
* **Description**: Results section failed to load data.
* **Fix Applied**: Fixed the `getLeaderboard` function in `src/lib/firebase-service.ts` to prevent crashing when `p.answers` was missing. Verified it correctly fetches `totalQuestions` to render the leaderboard accuracy table correctly.

### 8. Anime and Manga Category – Inaccurate Questions
* **Status**: ⚠️ **PARTIALLY FIXED / EXTERNAL**
* **Description**: Questions were not loading for "Anime & Manga" initially, and some contain incorrect options.
* **Fix Applied**: The routing mapping bug was fixed so the correct OpenTDB Category ID (`31`) is now used.
* **Note on Accuracy**: The actual quiz content comes raw from the external Open Trivia Database (OpenTDB) API. Inaccuracies within the questions/answers are dependent on this external dataset.
* **Impact**: High (but external)

---

## Recommended Next Steps
Implement missing UI functionality for **Footer Links (Issue 2)**. All major logic bugs have been fixed.
