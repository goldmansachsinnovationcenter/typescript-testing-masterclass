import React, { useEffect, useState } from 'react';
import ExampleCard from './ExampleCard';

type Example = {
  fileName: string;
  dirName: string;
  description: string;
  isTestFile: boolean;
  path: string;
  codeBlocks?: Array<{
    title: string;
    code: string;
    type: string;
  }>;
};

type ExampleListProps = {
  category: 'unit-tests' | 'integration-tests' | 'e2e-tests' | 'common-patterns';
};

const ExampleList: React.FC<ExampleListProps> = ({ category }) => {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadExamples() {
      try {
        const basePath = process.env.NODE_ENV === 'production' 
          ? `/${process.env.CI_PROJECT_NAME || ''}`
          : '';
        const response = await fetch(`${basePath}/content/${category}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load examples: ${response.statusText}`);
        }
        const data = await response.json();
        setExamples(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    loadExamples();
  }, [category]);

  if (loading) {
    return <div className="loading">Loading examples...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (examples.length === 0) {
    return <div className="no-examples">No examples found for this category.</div>;
  }

  return (
    <div className="example-list">
      {examples.map((example, index) => {
        if (category === 'common-patterns' && 'title' in example) {
          return (
            <div key={index} className="pattern-card">
              <h3>{(example as any).title}</h3>
              <p>{(example as any).description}</p>
              <div className="related-examples">
                <h4>Related Examples:</h4>
                <ul>
                  {(example as any).examples?.map((ex: any, i: number) => (
                    <li key={i}>
                      {ex.fileName} ({ex.dirName})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        }

        const codeBlock = example.codeBlocks?.[0] || { code: '', title: '', type: '' };
        return (
          <ExampleCard
            key={index}
            title={example.fileName}
            description={example.description}
            code={codeBlock.code}
            language={example.fileName.endsWith('.tsx') ? 'tsx' : 'typescript'}
            fileName={example.fileName}
            category={example.dirName}
            sourceLink={`https://github.com/goldmansachsinnovationcenter/typescript-testing-masterclass/blob/main/src/examples/${example.path}`}
          />
        );
      })}

      <style>{`
        .example-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .loading, .error, .no-examples {
          padding: 2rem;
          text-align: center;
          background-color: #f9f9f9;
          border-radius: 0.5rem;
        }
        .error {
          color: #e53e3e;
        }
        .pattern-card {
          padding: 1.5rem;
          border-radius: 0.5rem;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .related-examples {
          margin-top: 1rem;
        }
        .related-examples ul {
          padding-left: 1.5rem;
        }
        .related-examples li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default ExampleList;
