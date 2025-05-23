import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

type CodeBlockProps = {
  code: string;
  language: string;
  fileName?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, fileName }) => {
  return (
    <div className="rounded-lg overflow-hidden border border-secondary">
      {fileName && (
        <div className="bg-background-dark px-4 py-2 border-b border-secondary font-mono text-sm text-foreground-dark">
          {fileName}
        </div>
      )}
      {/* @ts-ignore - Type compatibility issue with Highlight component after PNPM conversion */}
      <Highlight
        theme={themes.vsDark}
        code={code.trim()}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} p-4 overflow-auto`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })} className="table-row">
                <span className="table-cell text-right pr-4 select-none text-secondary text-xs w-12">
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
