import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Sidebar from './Sidebar';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'TypeScript Testing Masterclass' }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* @ts-ignore - Type compatibility issue with Link component after PNPM conversion */}
            <Link href="/" className="text-2xl font-bold text-primary">
              TypeScript Testing Masterclass
            </Link>
            <nav className="hidden md:flex space-x-6">
              {/* @ts-ignore - Type compatibility issue with Link component after PNPM conversion */}
              <Link href="/unit-tests" className="text-gray-700 hover:text-primary transition-colors">
                Unit Tests
              </Link>
              {/* @ts-ignore - Type compatibility issue with Link component after PNPM conversion */}
              <Link href="/integration-tests" className="text-gray-700 hover:text-primary transition-colors">
                Integration Tests
              </Link>
              {/* @ts-ignore - Type compatibility issue with Link component after PNPM conversion */}
              <Link href="/e2e-tests" className="text-gray-700 hover:text-primary transition-colors">
                E2E Tests
              </Link>
              {/* @ts-ignore - Type compatibility issue with Link component after PNPM conversion */}
              <Link href="/common-patterns" className="text-gray-700 hover:text-primary transition-colors">
                Common Patterns
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            TypeScript Testing Masterclass Documentation - 
            <a href="https://github.com/goldmansachsinnovationcenter/typescript-testing-masterclass" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-primary hover:underline ml-1">
              GitHub Repository
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
