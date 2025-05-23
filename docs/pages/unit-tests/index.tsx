import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function UnitTests() {
  return (
    <Layout title="Unit Tests - TypeScript Testing Masterclass">
      <div className="content">
        <h1>Unit Tests</h1>
        <p>
          Unit tests focus on testing individual components or functions in isolation.
          This section covers techniques for effective unit testing in TypeScript with Vitest.
        </p>
        
        <div className="categories">
          <h2>Categories</h2>
          <p className="text-sm text-foreground-dark mb-4">
            Click on categories in the filter below to show/hide examples from specific directories.
            Use the Select All and Clear buttons to quickly manage your filters.
          </p>
        </div>
        
        <div className="examples">
          <h2>Examples</h2>
          <ExampleList category="unit-tests" />
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
