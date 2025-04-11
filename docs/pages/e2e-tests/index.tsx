import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function E2ETests() {
  return (
    <Layout title="E2E Tests - TypeScript Testing Masterclass">
      <div className="content">
        <h1>E2E and Advanced Tests</h1>
        <p>
          End-to-end and advanced tests verify complete workflows and complex scenarios.
          This section covers techniques for E2E and advanced testing in TypeScript with Vitest.
        </p>
        
        <div className="categories">
          <h2>Categories</h2>
          <ul>
            <li>Accessibility Testing</li>
            <li>Asynchronous Testing</li>
            <li>Node.js Testing</li>
          </ul>
        </div>
        
        <div className="examples">
          <h2>Examples</h2>
          <ExampleList category="e2e-tests" />
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
