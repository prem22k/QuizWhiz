'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Zap, Users, Brain, Sparkles, ArrowRight, Trophy, Timer, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileNav from '@/components/mobile-nav';

// Scroll-triggered animation component
function AnimatedSection({
  children,
  className = '',
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(40px)'
      }}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Generate quizzes on any topic using advanced AI'
    },
    {
      icon: Users,
      title: 'Real-Time',
      description: 'Compete with friends in live multiplayer sessions'
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Track scores and crown the ultimate champion'
    }
  ];

  const steps = [
    { num: '01', title: 'Create', desc: 'Pick a topic or let AI generate one' },
    { num: '02', title: 'Share', desc: 'Invite players with a simple code' },
    { num: '03', title: 'Play', desc: 'Answer fast to climb the leaderboard' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-[#ccff00] selection:text-black">

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ══════════════════════════════════════════════════════════════════════════
          HERO SECTION - Parallax
      ══════════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Parallax background elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-[#ccff00]/20 to-transparent blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-purple-500/10 to-transparent blur-3xl" />
        </div>

        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #ccff00 1px, transparent 1px),
              linear-gradient(to bottom, #ccff00 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            transform: `translateY(${scrollY * 0.1}px)`
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#ccff00]/10 border border-[#ccff00]/30 px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-[#ccff00]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#ccff00]">Real-Time Quiz Platform</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
            <span className="block text-white">Challenge</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#ccff00] to-yellow-400">Your Brain</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 font-light">
            Create AI-powered quizzes, compete in real-time, and prove you're the smartest in the room.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push('/play')}
              className="h-14 px-8 bg-[#ccff00] hover:bg-[#bbee00] text-black font-black uppercase tracking-widest text-sm group"
            >
              Play Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/host/create')}
              className="h-14 px-8 border-2 border-white/20 hover:border-[#ccff00] hover:text-[#ccff00] font-bold uppercase tracking-widest text-sm bg-transparent"
            >
              Create Quiz
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#ccff00] to-transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ccff00] mb-4 block">Why QuizWhiz</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Next-Gen Trivia
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <AnimatedSection key={feature.title} delay={i * 150}>
                <div className="group p-8 bg-[#0a0a0a] border border-[#222] hover:border-[#ccff00]/50 transition-all duration-300">
                  <div className="w-14 h-14 bg-[#ccff00]/10 flex items-center justify-center mb-6 group-hover:bg-[#ccff00]/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-[#ccff00]" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
        {/* Parallax accent */}
        <div
          className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#ccff00]/5 to-transparent blur-3xl pointer-events-none"
          style={{ transform: `translateY(${(scrollY - 800) * 0.2}px)` }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <AnimatedSection className="text-center mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ccff00] mb-4 block">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Three Simple Steps
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 150}>
                <div className="relative p-8 border-l-4 border-[#ccff00]">
                  <span className="text-6xl font-black text-[#ccff00]/10 absolute -top-4 -left-2">{step.num}</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide mb-3 relative z-10">{step.title}</h3>
                  <p className="text-gray-500 relative z-10">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          CATEGORIES PREVIEW
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#ccff00] mb-4 block">Categories</span>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
              Endless Topics
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={200}>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {['General Knowledge', 'Movies', 'Sports', 'Geography', 'Video Games', 'History', 'Science'].map((cat) => (
                <div
                  key={cat}
                  className="flex-shrink-0 px-6 py-4 bg-[#111] border border-[#333] hover:border-[#ccff00] transition-colors cursor-pointer"
                >
                  <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">{cat}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════════════════════════════ */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-[#ccff00]/10 blur-[150px]" />
        </div>

        <AnimatedSection className="relative z-10 text-center max-w-3xl mx-auto">
          <Gamepad2 className="w-16 h-16 text-[#ccff00] mx-auto mb-8" />
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
            Ready to Play?
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join thousands of players challenging their knowledge every day.
          </p>
          <Button
            onClick={() => router.push('/play')}
            className="h-16 px-12 bg-[#ccff00] hover:bg-[#bbee00] text-black font-black uppercase tracking-widest text-base group shadow-[0_0_60px_rgba(204,255,0,0.3)]"
          >
            Start Playing
            <Zap className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
          </Button>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#222]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-sm text-gray-600 font-mono">© 2025 QUIZWHIZ</span>
          <div className="flex gap-6">
            <Link href="/play" className="text-sm text-gray-500 hover:text-[#ccff00] transition-colors">Play</Link>
            <Link href="/host/create" className="text-sm text-gray-500 hover:text-[#ccff00] transition-colors">Create</Link>
            <Link href="/join" className="text-sm text-gray-500 hover:text-[#ccff00] transition-colors">Join</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
