import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
  code: string;
  language: string;
  fileName?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  return (
    <div className="code-block">
      {fileName && <div className="code-filename">{fileName}</div>}
      <Highlight
        theme={themes.github}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                <span className="line-number">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <style jsx>{`
        .code-block {
          margin: 1.5rem 0;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .code-filename {
          background-color: #f6f8fa;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid #e1e4e8;
          font-family: monospace;
          font-size: 0.9rem;
          color: #24292e;
        }
        .line-number {
          display: inline-block;
          width: 2rem;
          text-align: right;
          margin-right: 1rem;
          color: #6a737d;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default CodeBlock;
