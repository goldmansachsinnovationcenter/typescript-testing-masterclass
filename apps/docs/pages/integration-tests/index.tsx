import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function IntegrationTests() {
  return (
    <Layout title="Integration Tests - TypeScript Testing Masterclass">
      <div className="content">
        <h1>Integration Tests</h1>
        <p>
          Integration tests verify that multiple components or systems work together correctly.
          This section covers techniques for integration testing in TypeScript with Vitest.
        </p>
        
        <div className="categories">
          <h2>Categories</h2>
          <ul>
            <li>React-specific Testing (Context, Router, Suspense)</li>
            <li>Lazy-loaded Components</li>
            <li>Dynamic Imports</li>
          </ul>
        </div>
        
        <div className="examples">
          <h2>Examples</h2>
          <ExampleList category="integration-tests" />
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
