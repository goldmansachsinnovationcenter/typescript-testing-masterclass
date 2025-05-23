import React from 'react';
import Layout from '../../components/Layout';
import ExampleList from '../../components/ExampleList';

export default function CommonPatterns() {
  return (
    <Layout title="Common Patterns - TypeScript Testing Masterclass">
      <div className="content">
        <h1>Common Patterns</h1>
        <p>
          This section covers reusable patterns and techniques that can be applied across different types of tests.
        </p>
        
        <div className="categories">
          <h2>Categories</h2>
          <ul>
            <li>Handling Hoisting</li>
            <li>Type Safety with MockedFunction</li>
            <li>Spy Assertions</li>
            <li>Mock Implementation</li>
            <li>Cross-test Spying</li>
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
