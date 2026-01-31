'use client';

import type { Quiz, LeaderboardEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Terminal, Trophy } from 'lucide-react';
import { downloadCsv } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import clsx from 'clsx';
import Link from 'next/link';

export default function LeaderboardClient({ quiz, leaderboardData }: { quiz: Quiz, leaderboardData: LeaderboardEntry[] }) {
    const { toast } = useToast();

    const handleExport = () => {
        const csvData = leaderboardData.map(({ rank, participantName, score, totalTime }) => ({
            Rank: rank,
            Name: participantName,
            Score: score,
            'Time (s)': totalTime.toFixed(2),
        }));

        downloadCsv(csvData, `leaderboard-${quiz.id}.csv`);
        toast({
            title: 'DATA EXTRACTION COMPLETE',
            description: 'PERFORMANCE LOG DOWNLOADED.',
        });
    };

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#050505] text-white font-display overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")` }}></div>
            <div className="absolute inset-0 pointer-events-none z-0 opacity-10" style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))',
                backgroundSize: '100% 4px'
            }}></div>

            <div className="container mx-auto p-4 md:p-8 relative z-10 max-w-4xl">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6 border-b border-[#333] pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-[#ccff00] mb-2">
                            <Trophy className="w-5 h-5" />
                            <span className="font-mono text-sm uppercase tracking-widest">Global Rankings</span>
                        </div>
                        <h1 className="font-black text-4xl uppercase tracking-tighter text-white">{quiz.title}</h1>
                    </div>
                    <Button
                        onClick={handleExport}
                        className="bg-[#0a0a0a] border border-[#333] hover:border-[#ccff00] hover:text-[#ccff00] text-gray-400 font-mono text-xs uppercase tracking-widest transition-colors h-10 px-6 rounded-none"
                    >
                        <Download className="mr-2 w-4 h-4" />
                        Extract Data Log
                    </Button>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-4">

                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-[#333] text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">
                        <div className="col-span-2 text-center">Rank</div>
                        <div className="col-span-6">Agent Identity</div>
                        <div className="col-span-4 text-right">Performance</div>
                    </div>

                    {leaderboardData.map((entry, index) => {
                        const isTop3 = entry.rank <= 3;
                        let rankColor = "text-gray-500";
                        let borderColor = "border-[#222]";
                        let bgColor = "bg-[#0a0a0a]";

                        if (entry.rank === 1) { rankColor = "text-yellow-500"; borderColor = "border-yellow-500"; bgColor = "bg-yellow-500/5"; }
                        else if (entry.rank === 2) { rankColor = "text-white"; borderColor = "border-white"; bgColor = "bg-white/5"; }
                        else if (entry.rank === 3) { rankColor = "text-orange-500"; borderColor = "border-orange-500"; bgColor = "bg-orange-500/5"; }

                        return (
                            <div key={entry.participantId} className={clsx(
                                "grid grid-cols-12 gap-4 px-6 py-4 border items-center transition-all hover:translate-x-1 group",
                                borderColor,
                                bgColor
                            )}>
                                <div className={clsx("col-span-2 text-center font-black text-xl italic", rankColor)}>
                                    #{String(entry.rank).padStart(2, '0')}
                                </div>

                                <div className="col-span-6">
                                    <div className="font-bold text-white uppercase tracking-tight text-lg">{entry.participantName}</div>
                                    <div className="text-[10px] font-mono text-gray-500">ID: {entry.participantId.substring(0, 8)}</div>
                                </div>

                                <div className="col-span-4 text-right">
                                    <div className="font-black text-2xl text-[#ccff00] tabular-nums">{entry.score}</div>
                                    <div className="text-[10px] font-mono text-gray-500">{entry.totalTime.toFixed(2)}s</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/">
                        <Button variant="link" className="text-gray-500 hover:text-white font-mono uppercase text-xs">
                            <Terminal className="mr-2 w-4 h-4" /> Return to Mainframe
                        </Button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
