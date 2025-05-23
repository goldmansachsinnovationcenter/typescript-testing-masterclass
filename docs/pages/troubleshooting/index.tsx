import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function Troubleshooting() {
  return (
    <Layout title="Troubleshooting - TypeScript Testing Masterclass">
      <div className="content">
        <h1>Troubleshooting Unit Tests</h1>
        <p>
          This section provides solutions for common issues encountered when writing and running tests with Vitest and TypeScript.
          Learn how to diagnose and fix problems in your test suite.
        </p>
        
        <div className="categories">
          <h2>Common Issues</h2>
          <ul>
            <li>Hoisting Problems with vi.mock()</li>
            <li>Type Errors in Test Files</li>
            <li>Async Test Failures</li>
            <li>Mock Implementation Challenges</li>
            <li>Timer and Event Loop Issues</li>
            <li>React Testing Library Gotchas</li>
          </ul>
        </div>
        
        <div className="examples">
          <h2>Examples</h2>
          <ExampleList category="common-patterns" />
        </div>
      </div>
      
      <style>{`
        .content {
          max-width: 1000px;
          margin: 0 auto;
        }
        h1 {
          margin-bottom: 1rem;
        }
        p {
          line-height: 1.6;
        }
        .categories {
          margin: 2rem 0;
        }
        .categories ul {
          padding-left: 1.5rem;
        }
        .categories li {
          margin-bottom: 0.5rem;
        }
        .examples {
          margin: 2rem 0;
        }
      `}</style>
    </Layout>
  );
}
