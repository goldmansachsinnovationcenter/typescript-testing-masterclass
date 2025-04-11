import React, { useState } from 'react';
import Link from 'next/link';
import CodeBlock from './CodeBlock';

type ExampleProps = {
  title: string;
  description: string;
  code: string;
  language: string;
  fileName: string;
  category: string;
  sourceLink?: string;
};

const ExampleCard: React.FC<ExampleProps> = ({
  title,
  description,
  code,
  language,
  fileName,
  category,
  sourceLink,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="example-card">
      <div className="card-header">
        <div className="title-section">
          <h3>{title}</h3>
          <div className="tags">
            <span className="tag">{category}</span>
            <span className="tag">{language}</span>
          </div>
        </div>
        <button 
          className="toggle-button"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      <p className="description">{description}</p>
      
      {expanded && (
        <div className="code-section">
          <CodeBlock code={code} language={language} fileName={fileName} />
          {sourceLink && (
            <div className="source-link">
              <Link href={sourceLink}>
                View source code
              </Link>
            </div>
          )}
        </div>
      )}
      
      <style jsx>{`
        .example-card {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border-radius: 0.5rem;
          background-color: #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        .title-section {
          display: flex;
          flex-direction: column;
        }
        h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #0070f3;
        }
        .description {
          margin-bottom: 1rem;
          color: #444;
        }
        .tags {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .tag {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background-color: #f0f7ff;
          color: #0070f3;
          font-size: 0.8rem;
        }
        .toggle-button {
          background-color: transparent;
          border: 1px solid #0070f3;
          color: #0070f3;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }
        .toggle-button:hover {
          background-color: #0070f3;
          color: white;
        }
        .code-section {
          margin-top: 1rem;
        }
        .source-link {
          margin-top: 1rem;
          text-align: right;
        }
        .source-link a {
          color: #0070f3;
          text-decoration: none;
        }
        .source-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ExampleCard;
