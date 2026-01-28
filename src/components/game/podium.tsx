import React from 'react';
import { Participant } from '@/types/quiz';

interface PodiumProps {
    participants: Participant[];
    isHost: boolean;
    onRestart: () => void;
}

export function Podium({ participants, isHost, onRestart }: PodiumProps) {
    // 1. Sort participants by score (descending)
    const sortedParticipants = [...participants].sort((a, b) => b.totalScore - a.totalScore);

    // 2. Extract Top 3 (Winners)
    const winners = sortedParticipants.slice(0, 3);

    // 3. Extract the rest (Others)
    const others = sortedParticipants.slice(3);

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Game Over</h1>

            {/* Winners Section */}
            <div style={{ margin: '20px 0', border: '1px solid black', padding: '10px' }}>
                <h2>Top 3</h2>
                {winners.map((p, index) => (
                    <div key={p.id}>
                        <strong>Rank {index + 1}:</strong> {p.name} - {p.totalScore} pts
                    </div>
                ))}
            </div>

            {/* Others Section */}
            {others.length > 0 && (
                <div style={{ margin: '20px 0', border: '1px solid gray', padding: '10px' }}>
                    <h3>Leaderboard</h3>
                    {others.map((p, index) => (
                        <div key={p.id}>
                            Rank {index + 4}: {p.name} - {p.totalScore} pts
                        </div>
                    ))}
                </div>
            )}

            {/* Restart Action */}
            {isHost && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={onRestart}>Restart Game</button>
                </div>
            )}
        </div>
    );
}
