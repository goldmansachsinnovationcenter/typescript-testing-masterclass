import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
  code: string;
  language: string;
  fileName?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {fileName && (
        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 font-mono text-sm text-gray-700">
          {fileName}
        </div>
      )}
      {/* @ts-ignore - Type compatibility issue with Highlight component after PNPM conversion */}
      <Highlight
        theme={themes.github}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 overflow-auto`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })} className="table-row">
                <span className="table-cell text-right pr-4 select-none text-gray-500 text-xs w-12">
                  {i + 1}
                </span>
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token, key })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
