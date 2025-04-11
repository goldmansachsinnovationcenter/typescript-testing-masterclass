import React from 'react';
import fs from 'fs';
import path from 'path';
import Layout from '../components/Layout';
import ReactMarkdown from 'react-markdown';

export async function getStaticProps() {
  const readmePath = path.join(process.cwd(), '../../README.md');
  const fileContents = fs.readFileSync(readmePath, 'utf8');

  return {
    props: {
      content: fileContents,
    },
  };
}

const OverviewPage = ({ content }) => {
  return (
    <Layout title="TypeScript Testing Masterclass - Overview">
      <div className="content">
        <h1>TypeScript Testing Masterclass</h1>
        <div className="markdown-content">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      <style jsx="true">{`
        .content {
          max-width: 1000px;
          margin: 0 auto;
        }
        .markdown-content {
          line-height: 1.6;
        }
      `}</style>
    </Layout>
  );
};

export default OverviewPage;
