import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

interface SubmitAnswerRequest {
    quizId: string;
    participantId: string;
    questionIndex: number;
    selectedOptionIndex: number;
}

interface SubmitAnswerResponse {
    success: boolean;
    isCorrect: boolean;
    pointsEarned: number;
}

/**
 * Secure answer submission Cloud Function
 * Calculates score server-side to prevent client-side cheating
 */
export const submitAnswerSecure = onCall<SubmitAnswerRequest>(async (request): Promise<SubmitAnswerResponse> => {
    const { quizId, participantId, questionIndex, selectedOptionIndex } = request.data;

    // Validate inputs
    if (!quizId || !participantId || questionIndex === undefined || selectedOptionIndex === undefined) {
        throw new HttpsError('invalid-argument', 'Missing required fields: quizId, participantId, questionIndex, selectedOptionIndex');
    }

    if (typeof questionIndex !== 'number' || typeof selectedOptionIndex !== 'number') {
        throw new HttpsError('invalid-argument', 'questionIndex and selectedOptionIndex must be numbers');
    }

    try {
        // Fetch questions from Firestore (ordered by 'order' field)
        const questionsSnap = await db
            .collection('quizzes')
            .doc(quizId)
            .collection('questions')
            .orderBy('order')
            .get();

        if (questionsSnap.empty) {
            throw new HttpsError('not-found', 'No questions found for this quiz');
        }

        const questionDoc = questionsSnap.docs[questionIndex];
        if (!questionDoc) {
            throw new HttpsError('not-found', `Question at index ${questionIndex} not found`);
        }

        const question = questionDoc.data();
        const correctOptionIndex = question.correctOptionIndex;
        const points = question.points || 100;

        // Calculate points server-side
        const isCorrect = selectedOptionIndex === correctOptionIndex;
        const pointsEarned = isCorrect ? points : 0;

        // Update participant document atomically
        const participantRef = db
            .collection('quizzes')
            .doc(quizId)
            .collection('participants')
            .doc(participantId);

        // Check if participant exists
        const participantSnap = await participantRef.get();
        if (!participantSnap.exists) {
            throw new HttpsError('not-found', 'Participant not found');
        }

        // Atomic update
        await participantRef.update({
            [`answers.${questionIndex}`]: selectedOptionIndex,
            totalScore: admin.firestore.FieldValue.increment(pointsEarned)
        });

        console.log(`✅ Answer submitted: quiz=${quizId}, participant=${participantId}, q=${questionIndex}, correct=${isCorrect}, points=${pointsEarned}`);

        return {
            success: true,
            isCorrect,
            pointsEarned
        };

    } catch (error) {
        if (error instanceof HttpsError) {
            throw error;
        }
        console.error('❌ Error in submitAnswerSecure:', error);
        throw new HttpsError('internal', 'Failed to submit answer');
    }
});
