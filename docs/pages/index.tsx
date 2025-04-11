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
        }
        .card {
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
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
      `}</style>
    </Layout>
  );
}
