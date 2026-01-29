import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';
import InstallPWAButton from '@/components/InstallPWAButton';

export const metadata: Metadata = {
  title: 'QuizWhiz - Real-time Quiz Platform',
  description: 'Create and join real-time quizzes.',
};

import ConsoleConfig from '@/components/ConsoleConfig';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-body antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ConsoleConfig />
        <ServiceWorkerRegister />
        {children}
        <InstallPWAButton />
        <Toaster />
      </body>
    </html>
  );
}
