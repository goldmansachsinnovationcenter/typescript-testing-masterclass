import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout title="TypeScript Testing Masterclass - Documentation">
      <div className="home-container">
        <h1>TypeScript Testing Masterclass</h1>
        <p className="description">
          A comprehensive guide to testing TypeScript applications with Vitest
        </p>

        <div className="grid">
          <Link href="/unit-tests" className="card">
            <h2>Unit Tests &rarr;</h2>
            <p>Learn how to write effective unit tests for TypeScript code.</p>
          </Link>

          <Link href="/integration-tests" className="card">
            <h2>Integration Tests &rarr;</h2>
            <p>Discover techniques for testing component interactions.</p>
          </Link>

          <Link href="/e2e-tests" className="card">
            <h2>E2E Tests &rarr;</h2>
            <p>Explore end-to-end and advanced testing strategies.</p>
          </Link>

          <Link href="/common-patterns" className="card">
            <h2>Common Patterns &rarr;</h2>
            <p>Reusable patterns and techniques for effective testing.</p>
          </Link>
          
          <Link href="/advanced-patterns" className="card">
            <h2>Advanced Patterns &rarr;</h2>
            <p>Sophisticated testing techniques combining multiple patterns.</p>
          </Link>

          <Link href="/troubleshooting" className="card">
            <h2>Troubleshooting &rarr;</h2>
            <p>Solutions for common testing issues and challenges.</p>
          </Link>
        </div>
        
        <div className="getting-started">
          <h2>Getting Started</h2>
          <p>
            This masterclass provides comprehensive examples and best practices for testing TypeScript applications using Vitest.
            Whether you're new to testing or looking to improve your existing test suite, you'll find valuable techniques and patterns here.
          </p>
          
          <h3>Installation</h3>
          <div className="code-block">
            <pre><code>npm install -D vitest @testing-library/react @testing-library/jest-dom</code></pre>
          </div>
          
          <h3>Key Features</h3>
          <ul>
            <li>Type-safe mocking and spying techniques</li>
            <li>React component testing strategies</li>
            <li>Asynchronous code testing</li>
            <li>Accessibility testing</li>
            <li>Node.js script testing</li>
            <li>Advanced patterns and troubleshooting</li>
          </ul>
        </div>
      </div>

      <style>{`
        .home-container {
          padding: 2rem 0;
        }
        .description {
          text-align: center;
          line-height: 1.5;
          font-size: 1.5rem;
          margin-bottom: 3rem;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .card {
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          background-color: white;
        }
        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }
        .card h2 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }
        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }
        .getting-started {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          margin-top: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .getting-started h2 {
          margin-top: 0;
        }
        .getting-started h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .code-block {
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 5px;
          overflow-x: auto;
          margin: 1rem 0;
        }
        .code-block pre {
          margin: 0;
        }
        .getting-started ul {
          padding-left: 1.5rem;
        }
        .getting-started li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </Layout>
  );
}
