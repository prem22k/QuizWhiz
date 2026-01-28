'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Trophy, Zap, Plane, Tv, BookOpen, PenTool, Share2, PlayCircle, BarChart3, GraduationCap, Lightbulb, Puzzle, Music, Smartphone, QrCode, Download, Smile } from 'lucide-react';
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

      {/* Decorative Background Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Airplane - Top Right floating */}
        <motion.div 
          className="absolute top-[12%] right-[8%] opacity-10 text-sky-500"
          animate={{ y: [0, -20, 0], rotate: [12, 10, 12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Plane className="w-32 h-32 md:w-64 md:h-64" />
        </motion.div>
        
        {/* Trophy - Bottom Left static */}
        <div className="absolute bottom-[15%] left-[2%] opacity-10 text-amber-500 -rotate-12">
          <Trophy className="w-40 h-40 md:w-72 md:h-72" />
        </div>

        {/* TV - Top Left floating */}
        <motion.div 
          className="absolute top-[22%] left-[5%] opacity-10 text-purple-500"
          animate={{ y: [0, 15, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Tv className="w-24 h-24 md:w-48 md:h-48" />
        </motion.div>

        {/* Book - Middle/Lower Right */}
        <div className="absolute top-[55%] right-[2%] opacity-10 text-pink-500 rotate-6">
          <BookOpen className="w-36 h-36 md:w-60 md:h-60" />
        </div>

        {/* Lightning - Center/Left area */}
        <motion.div 
          className="absolute top-[40%] left-[15%] opacity-10 text-yellow-500"
          animate={{ scale: [1, 1.05, 1], rotate: [45, 40, 45] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Zap className="w-16 h-16 md:w-32 md:h-32" />
        </motion.div>

        {/* Lightbulb - Top Center/Left */}
        <motion.div 
          className="absolute top-[8%] left-[45%] opacity-10 text-emerald-500"
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Lightbulb className="w-20 h-20 md:w-40 md:h-40" />
        </motion.div>

        {/* Puzzle - Bottom Center/Left */}
        <motion.div 
          className="absolute bottom-[25%] left-[35%] opacity-10 text-indigo-500"
           animate={{ rotate: [0, 10, 0] }}
           transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Puzzle className="w-24 h-24 md:w-52 md:h-52" />
        </motion.div>

        {/* Music - Middle Left Edge */}
        <motion.div 
          className="absolute top-[65%] left-[3%] opacity-10 text-rose-400"
          animate={{ y: [0, -15, 0], rotate: [-10, -5, -10] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        >
          <Music className="w-16 h-16 md:w-36 md:h-36" />
        </motion.div>

       {/* Graduation Cap - Bottom Right */}
        <motion.div 
          className="absolute bottom-[8%] right-[12%] opacity-10 text-slate-800"
          animate={{ scale: [1, 1.1, 1], rotate: [-5, 0, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <GraduationCap className="w-28 h-28 md:w-56 md:h-56" />
        </motion.div>
      </div>
      
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
        
        {/* Feature Showcase (Bento Grid) */}
        <section className="py-32 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px] w-full">
            
            {/* Large Hero Box: Instant Sync */}
            <div className="md:col-span-2 md:row-span-2 bg-[#F0FDF4]/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden group hover:shadow-lg transition-all border border-white/40">
              <div className="z-10 relative h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-2">Instant Sync</h3>
                  <p className="text-slate-500 text-lg">Real-time connection between host and players. Zero lag.</p>
                </div>
                {/* Illustration Placeholder */}
                <div className="mt-8 flex items-center justify-center gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-24 h-16 bg-emerald-200 rounded-lg flex items-center justify-center shadow-sm">
                    <Tv className="w-8 h-8 text-emerald-600" />
                  </div>
                  <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
                  <div className="w-12 h-20 bg-emerald-200 rounded-lg flex items-center justify-center shadow-sm">
                    <Smartphone className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-100 rounded-full blur-[80px]" />
            </div>

            {/* Small Box: No Installs */}
            <div className="md:col-span-1 md:row-span-1 bg-[#EEF2FF]/80 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group hover:shadow-lg transition-all border border-white/40 flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-[40px] -mr-8 -mt-8" />
              <div className="w-14 h-14 bg-indigo-100/80 rounded-2xl flex items-center justify-center mb-4 text-indigo-500">
                <QrCode className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">No Installs</h3>
                <p className="text-slate-500 text-sm mt-1">Scan & play instantly.</p>
              </div>
            </div>

            {/* Small Box: Live Reactions */}
            <div className="md:col-span-1 md:row-span-1 bg-[#FFF1F2]/80 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group hover:shadow-lg transition-all border border-white/40 flex flex-col justify-between">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-rose-100 rounded-full blur-[40px] -ml-8 -mb-8" />
              <div className="relative h-14 mb-4">
                 <Smile className="w-10 h-10 text-rose-400 absolute top-0 left-0 animate-bounce" />
                 <div className="absolute top-2 left-8 text-2xl">🎉</div>
                 <div className="absolute -top-2 left-12 text-2xl">🔥</div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Live Reactions</h3>
                <p className="text-slate-500 text-sm mt-1">Interactive emojis.</p>
              </div>
            </div>

            {/* Medium Box: Export Results */}
            <div className="md:col-span-2 md:row-span-1 bg-[#FDF4FF]/80 backdrop-blur-xl rounded-[2.5rem] p-8 relative overflow-hidden group hover:shadow-lg transition-all border border-white/40 flex items-center justify-between">
               <div className="max-w-[60%] z-10">
                 <h3 className="text-2xl font-bold text-slate-800 mb-2">Export Results</h3>
                 <p className="text-slate-500">Download detailed reports and analytics in one click.</p>
               </div>
               <div className="w-16 h-16 bg-fuchsia-100 rounded-2xl flex items-center justify-center text-fuchsia-500 shadow-sm group-hover:scale-110 transition-transform">
                 <Download className="w-8 h-8" />
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-100/50 rounded-full blur-[60px]" />
            </div>

          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-32 px-4 md:px-8 relative overflow-hidden">
          {/* Blobs */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[80px] -z-10 -translate-x-1/3 translate-y-1/3" />

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24 relative z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#0F172A] tracking-tight mb-6">How it Works</h2>
              <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                 Launch your first game in four simple steps.
              </p>
            </div>

            <div className="relative z-10 w-full">
              
              <div className="grid md:grid-cols-4 gap-6 relative">
                {[
                  { 
                    title: 'Create', 
                    desc: "Draft questions, set timers, and customize flow.",
                    icon: PenTool,
                    color: "text-blue-500",
                    bg: "bg-blue-100/50"
                  },
                  { 
                    title: 'Share', 
                    desc: "Instant join via QR code or PIN. No install needed.",
                    icon: Share2,
                    color: "text-purple-500",
                    bg: "bg-purple-100/50"
                  },
                  { 
                    title: 'Control', 
                    desc: "Manage the live pace. Reveal answers in real-time.",
                    icon: PlayCircle,
                    color: "text-amber-500",
                    bg: "bg-amber-100/50"
                  },
                  { 
                    title: 'Results', 
                    desc: "Live leaderboards and detailed performance stats.",
                    icon: BarChart3,
                    color: "text-pink-500",
                    bg: "bg-pink-100/50"
                  }
                ].map((step, idx) => (
                  <div key={idx} className={`relative flex flex-col ${idx % 2 === 1 ? 'md:mt-32' : ''}`}>
                    
                    {/* Arrow Connections (Desktop Only) */}
                    {idx < 3 && (
                      <div className={`hidden md:block absolute top-1/2 -right-12 w-24 h-24 pointer-events-none z-0 ${idx % 2 === 0 ? 'translate-y-4' : '-translate-y-20'}`}>
                         <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-300">
                           {idx % 2 === 0 ? (
                             // Downward curve (High to Low)
                             <path d="M0 20 C 40 20, 40 80, 100 80" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                           ) : (
                             // Upward curve (Low to High)
                             <path d="M0 80 C 40 80, 40 20, 100 20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" />
                           )}
                           {/* Arrowhead */}
                           <path d={idx % 2 === 0 ? "M90 70 L100 80 L90 90" : "M90 10 L100 20 L90 30"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                      </div>
                    )}

                    <div className="
                      bg-white/70 backdrop-blur-xl rounded-[2rem] p-6 
                      shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                      hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]
                      transition-all duration-300 border border-white/50
                      flex flex-col items-center text-center h-full relative z-10
                    ">
                      
                      {/* Icon */}
                      <div className={`
                        w-14 h-14 rounded-2xl mb-4 flex items-center justify-center 
                        ${step.bg} ${step.color} shadow-sm
                      `}>
                        <step.icon className="w-7 h-7" strokeWidth={2} />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-slate-800 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
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
