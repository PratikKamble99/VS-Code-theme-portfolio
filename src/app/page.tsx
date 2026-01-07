'use client';

import { Suspense } from 'react';
import { WelcomePage, LoadingScreen } from '@/components/ui';
import { Taskbar } from '@/components/layout';
import { AnimationProvider } from '@/components/providers';
import { ThemeProvider } from '@/contexts';
import { useFullscreen } from '@/hooks';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const pathname = usePathname();

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <AnimationProvider>
        {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

        <main className="h-screen bg-vscode-bg text-vscode-text relative overflow-hidden flex flex-col">
          {/* Taskbar */}
          {pathname !== "/" && <Taskbar
            onClose={() => { }} // No terminal on welcome page
            onMinimize={() => { }} // No terminal on welcome page
            onFullscreen={toggleFullscreen}
            isTerminalVisible={false}
            isTerminalMinimized={false}
            isFullscreen={isFullscreen}
            userName="Pratik Kamble"
          />}

          {/* Welcome Page Content */}
          <div className="flex-1 overflow-hidden">
            <Suspense fallback={<div>Loading...</div>}>
              <WelcomePage />
            </Suspense>
          </div>
        </main>
      </AnimationProvider>
    </ThemeProvider>
  );
}