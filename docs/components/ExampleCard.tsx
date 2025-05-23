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
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">{title}</h3>
            <div className="flex gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary">
                {category}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {language}
              </span>
            </div>
          </div>
          <button 
            className="px-3 py-1.5 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        {expanded && (
          <div className="mt-4">
            <CodeBlock code={code} language={language} fileName={fileName} />
            {sourceLink && (
              <div className="mt-4 text-right">
                <Link 
                  href={sourceLink}
                  className="text-primary hover:underline font-medium"
                >
                  View source code
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExampleCard;
