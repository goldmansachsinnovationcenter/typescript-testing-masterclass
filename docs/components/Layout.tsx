import React, { ReactNode } from 'react';
import Link from 'next/link';
import Head from 'next/head';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

const Layout = ({ children, title = 'TypeScript Testing Masterclass' }: LayoutProps) => {
  return (
    <div className="container">
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <nav>
          <Link href="/" className="logo">
            TypeScript Testing Masterclass
          </Link>
          <div className="nav-links">
            <Link href="/unit-tests" className="nav-link">
              Unit Tests
            </Link>
            <Link href="/integration-tests" className="nav-link">
              Integration Tests
            </Link>
            <Link href="/e2e-tests" className="nav-link">
              E2E Tests
            </Link>
            <Link href="/common-patterns" className="nav-link">
              Common Patterns
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>
          TypeScript Testing Masterclass Documentation - 
          <a href="https://github.com/goldmansachsinnovationcenter/typescript-testing-masterclass" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </p>
      </footer>
      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        header {
          padding: 1rem 0;
          border-bottom: 1px solid #eaeaea;
        }
        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
        }
        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: #0070f3;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link {
          color: #444;
          text-decoration: none;
        }
        .nav-link:hover {
          color: #0070f3;
          text-decoration: underline;
        }
        main {
          flex: 1;
          padding: 2rem 0;
        }
        footer {
          padding: 2rem 0;
          border-top: 1px solid #eaeaea;
          text-align: center;
        }
        footer a {
          color: #0070f3;
          text-decoration: none;
        }
      `}</style>
      <style>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Layout;
