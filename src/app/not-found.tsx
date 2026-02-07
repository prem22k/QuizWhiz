import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Home, AlertTriangle } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">

            {/* Background Noise */}
            <div className="absolute inset-0 pointer-events-none opacity-20 z-0" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")` }}></div>

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-md">

                {/* glitched 404 */}
                <div className="relative">
                    <h1 className="text-9xl font-black text-[#ccff00] font-mono tracking-tighter opacity-20 select-none">404</h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle className="w-24 h-24 text-[#ccff00] animate-pulse" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tight font-display">
                        Signal Lost
                    </h2>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed">
                        We couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button className="h-14 px-8 bg-[#ccff00] hover:bg-[#bbee00] text-black font-black uppercase tracking-widest rounded-none gap-2 hover:scale-105 transition-transform">
                            <Home className="w-4 h-4" />
                            Return Home
                        </Button>
                    </Link>
                </div>

                {/* Decorative Code */}
                <div className="mt-12 opacity-30 font-mono text-[10px] text-[#ccff00] text-left w-full space-y-1">
                    <p>{`> ERROR_CODE: PAGE_NOT_FOUND`}</p>
                    <p>{`> SYSTEM: NAVIGATION_FAILURE`}</p>
                    <p>{`> ACTION: REROUTING...`}</p>
                </div>

            </div>
        </div>
    );
}
