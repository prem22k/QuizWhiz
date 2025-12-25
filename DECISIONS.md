# Architectural Decisions

This document records the key architectural choices made during the development of QuizWhiz, including the context and consequences of each decision.

## 1. Firebase (BaaS) vs. Custom Backend
*   **Decision**: Use Firebase (Firestore + Auth) instead of a custom Node.js/Express server.
*   **Why**:
    *   **Speed**: Drastically reduced development time for real-time features.
    *   **Scalability**: Firestore handles connection scaling automatically.
    *   **Cost**: Generous free tier suitable for MVP and small-to-medium events.
*   **Trade-off**: Vendor lock-in and limited complex query capabilities compared to SQL.

## 2. Firestore Listeners vs. Polling/WebSockets
*   **Decision**: Use Firestore `onSnapshot` listeners for game state synchronization.
*   **Why**:
    *   **Simplicity**: Native SDK handles connection stability, offline support, and reconnection logic.
    *   **Latency**: Updates are pushed instantly to clients, essential for a quiz game.
    *   **Efficiency**: More efficient than HTTP polling; easier to implement than raw WebSockets (Socket.io).

## 3. Anonymous Participant Authentication
*   **Decision**: Participants join with just a Name and Code; no email/password required.
*   **Why**:
    *   **Friction**: Requiring accounts kills engagement at live events.
    *   **Privacy**: No need to collect or store sensitive user data for transient game sessions.
*   **Trade-off**: Harder to prevent duplicate joins or ban users persistently.

## 4. Client-Side Scoring (MVP)
*   **Decision**: Calculate scores on the client (initially) and validate.
*   **Why**:
    *   **Responsiveness**: Immediate feedback for the user.
    *   **Simplicity**: Avoids setting up Cloud Functions for the initial prototype.
*   **Limitation**: Vulnerable to cheating (manipulated requests).
*   **Future**: Move scoring logic to a Firebase Cloud Function trigger for production security.

## 5. Next.js App Router
*   **Decision**: Use Next.js 16 with the App Router.
*   **Why**:
    *   **Performance**: Server Components reduce bundle size.
    *   **Routing**: Intuitive file-system based routing for `/admin`, `/join`, `/play`.
    *   **Future-Proofing**: Aligns with the latest React ecosystem standards.

## 6. Tailwind CSS + Radix UI
*   **Decision**: Utility-first CSS with headless UI components.
*   **Why**:
    *   **Speed**: Rapid UI iteration without writing custom CSS files.
    *   **Accessibility**: Radix primitives ensure keyboard navigation and screen reader support out of the box.
