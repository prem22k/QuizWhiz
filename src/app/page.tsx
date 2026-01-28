'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Trophy, Zap } from 'lucide-react';
import Header from '@/components/header';
import TopicGrid from '@/components/topic-grid';
// import { seedFirstAdmin } from '@/lib/seed-admin';

export default function HomePage() {
  // Uncomment to seed your email as admin, then re-comment
  // seedFirstAdmin('your-email@example.com');

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FDFCF6] text-slate-800 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div 
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-60 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E0F2FE 0%, #D1FAE5 100%)' }} 
      />
      <div 
        className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-40 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #BEF264 0%, transparent 70%)' }} 
      />
      
      <div className="z-10 relative">
        <Header />
      </div>

      <main className="flex-1 relative z-10">
        
        {/* Hero Section */}
        <section className="py-24 px-4 text-center relative">
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-sans font-extrabold text-5xl md:text-7xl mb-6 tracking-tight text-slate-900"
            >
              QuizWhiz
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Create engaging real-time quizzes with live results and leaderboards
            </motion.p>
 
            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-4 sm:gap-6 justify-center flex-wrap"
            >
              <Button 
                asChild 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg bg-[#93C5FD] hover:bg-[#60A5FA] text-slate-900 font-semibold shadow-sm hover:-translate-y-1 transition-all duration-300 border-none"
              >
                <Link href="/join">Join Quiz</Link>
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="rounded-full px-8 py-6 text-lg bg-[#86EFAC] hover:bg-[#4ADE80] text-slate-900 font-semibold shadow-sm hover:-translate-y-1 transition-all duration-300 border-none"
              >
                <Link href="/login">Admin Login</Link>
              </Button>
            </motion.div>

          </div>
        </section>

        <TopicGrid />

        {/* Features Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { 
                  icon: Zap, 
                  title: "Real-Time Updates", 
                  desc: "Live synchronization between admin and participants. See answers come in real-time." 
                },
                { 
                  icon: Users, 
                  title: "Easy Join", 
                  desc: "Participants join via QR code or 6-digit code. No accounts needed for players." 
                },
                { 
                  icon: Trophy, 
                  title: "Live Leaderboard", 
                  desc: "Track scores in real-time with speed-based scoring for maximum engagement." 
                }
              ].map((feature, i) => (
                <Card key={i} className="border-0 bg-[#F1F5F9]/60 backdrop-blur-xl shadow-none hover:bg-white rounded-[24px] transition-all duration-300">
                  <CardHeader>
                    <div className="h-14 w-14 rounded-2xl bg-[#E0F2FE] flex items-center justify-center mb-4 text-[#0EA5E9]">
                      <feature.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-500 text-lg leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 px-4 md:px-8 relative bg-[#F0FDF4]/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <span className="bg-[#DCFCE7] text-[#15803D] px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase">Simple Steps</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">How It Works</h2>
            </div>

            <div className="relative">
              {/* Dashed Line Connector (Hidden on mobile) */}
              <div className="hidden md:block absolute top-[24px] left-[50px] right-[50px] h-[2px] border-t-2 border-dashed border-slate-200 -z-10" />

              <div className="grid md:grid-cols-4 gap-12">
                {[
                  { title: 'Create', desc: "Add questions & set time limits." },
                  { title: 'Share', desc: "Participants join via code." },
                  { title: 'Control', desc: "Start & manage the live flow." },
                  { title: 'Result', desc: "View rankings & winners." }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-12 h-12 rounded-full bg-[#86EFAC] text-slate-900 flex items-center justify-center font-bold text-xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ring-4 ring-white">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer minimal */}
      <footer className="py-8 text-center text-slate-400 text-sm bg-white/50 backdrop-blur-sm">
        <p>© {new Date().getFullYear()} QuizWhiz. Ready for fun?</p>
      </footer>
    </div>
  );
}
