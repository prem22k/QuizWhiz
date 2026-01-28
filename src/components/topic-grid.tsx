'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Film, Trophy, Globe, BookOpen, Monitor, Sparkles } from 'lucide-react';
import { createQuickGame, createAIQuickQuiz } from '@/lib/firebase-service';
import { TRIVIA_CATEGORIES } from '@/lib/trivia-service';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TOPICS = [
    { id: TRIVIA_CATEGORIES.GENERAL_KNOWLEDGE, name: 'General Knowledge', icon: BookOpen, color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400' },
    { id: TRIVIA_CATEGORIES.MOVIES, name: 'Movies', icon: Film, color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400' },
    { id: TRIVIA_CATEGORIES.SPORTS, name: 'Sports', icon: Trophy, color: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-400' },
    { id: TRIVIA_CATEGORIES.GEOGRAPHY, name: 'Geography', icon: Globe, color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400' },
    { id: TRIVIA_CATEGORIES.VIDEO_GAMES, name: 'Video Games', icon: Monitor, color: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400' },
    { id: TRIVIA_CATEGORIES.HISTORY, name: 'History', icon: BookOpen, color: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400' },
];

export default function TopicGrid() {
    const router = useRouter();
    const [loading, setLoading] = useState<number | string | null>(null); // storing category ID or 'custom'
    const [isCustomOpen, setIsCustomOpen] = useState(false);
    const [customTopic, setCustomTopic] = useState('');

    const handleTopicClick = async (categoryId: number, topicName: string) => {
        setLoading(categoryId);
        try {
            console.log(`🎮 Starting Quick Game: ${topicName}`);

            // Call the consolidated Quick Play function
            // This handles auth, question fetching, and quiz creation
            const quizId = await createQuickGame(topicName, 'medium');

            // Redirect to the new Unified Game Room
            router.push(`/play/${quizId}`);

        } catch (error) {
            console.error('❌ Error starting game:', error);
            alert('Failed to start game. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const handleCustomGenerate = async () => {
        if (!customTopic.trim()) return;
        setLoading('custom');
        try {
            console.log(`✨ Generating AI Quiz: ${customTopic}`);
            const quizId = await createAIQuickQuiz(customTopic);
            setIsCustomOpen(false);
            router.push(`/play/${quizId}`);
        } catch (error) {
            console.error('❌ Error generating quiz:', error);
            alert('Failed to generate quiz. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <section className="py-12 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <Zap className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                    <h2 className="text-3xl font-bold text-center">Quick Play</h2>
                </div>
                <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Jump straight into a game! Pick a topic, we'll generate the quiz, invite your friends, and play instantly. No login required.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {TOPICS.map((topic) => (
                        <Card
                            key={topic.id}
                            className={`
                                cursor-pointer transition-all duration-300 rounded-2xl border-[1.5px]
                                hover:border-[2.5px] hover:scale-[1.02] hover:shadow-md
                                ${topic.color} shadow-sm backdrop-blur-sm
                                ${loading === topic.id ? 'opacity-70' : ''}
                            `}
                            style={{ boxShadow: "inset 0 0 20px 0 rgba(255,255,255,0.5)" }}
                            onClick={() => !loading && handleTopicClick(topic.id, topic.name)}
                        >
                            <CardContent className="p-6 flex flex-col items-center justify-center aspect-square text-center gap-4">
                                <div className={`p-4 rounded-full bg-white/80 shadow-sm`}>
                                    {loading === topic.id ? (
                                        <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                    ) : (
                                        <topic.icon className="h-6 w-6" />
                                    )}
                                </div>
                                <h3 className="font-bold text-slate-800 text-sm md:text-base">{topic.name}</h3>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Custom Topic Card */}
                    <Card
                        className={`
                            cursor-pointer transition-all duration-300 rounded-2xl
                            border-2 border-dashed border-purple-500 bg-purple-50/50
                            hover:scale-[1.02] hover:shadow-md hover:border-purple-600
                            ${loading === 'custom' ? 'opacity-70' : ''}
                        `}
                        onClick={() => setIsCustomOpen(true)}
                    >
                        <CardContent className="p-6 flex flex-col items-center justify-center aspect-square text-center gap-4">
                            <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                                {loading === 'custom' ? (
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : (
                                    <Sparkles className="h-6 w-6" />
                                )}
                            </div>
                            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                Custom Topic
                            </h3>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Your Own</DialogTitle>
                            <DialogDescription>
                                Enter any topic, and our AI will generate a unique quiz for you!
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="topic">Topic</Label>
                                <Input
                                    id="topic"
                                    placeholder="e.g. Taylor Swift, Python Programming, 90s Sitcoms"
                                    value={customTopic}
                                    onChange={(e) => setCustomTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCustomGenerate()}
                                    autoFocus
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCustomOpen(false)}>Cancel</Button>
                            <Button onClick={handleCustomGenerate} disabled={!customTopic.trim() || loading === 'custom'}>
                                {loading === 'custom' ? 'Generating...' : 'Generate Quiz'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}
