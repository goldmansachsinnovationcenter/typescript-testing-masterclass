import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function AdvancedPatterns() {
  return (
    <Layout title="Advanced Patterns - TypeScript Testing Masterclass">
      <div className="content">
        <h1>Advanced Patterns</h1>
        <p>
          This section covers advanced testing patterns and techniques for TypeScript applications with Vitest.
          Learn how to combine multiple patterns and create more sophisticated test scenarios.
        </p>
        
        <div className="categories">
          <h2>Key Concepts</h2>
          <ul>
            <li>Combining Custom Hooks with Context</li>
            <li>Type-Safe Testing with Branded Types</li>
            <li>Discriminated Unions for Robust Type Checking</li>
            <li>Advanced Error Handling Patterns</li>
            <li>Testing Edge Cases and Race Conditions</li>
          </ul>
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
