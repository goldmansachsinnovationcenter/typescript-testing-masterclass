    const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = path.join(__dirname, '../../../packages/examples/src');
const OUTPUT_DIR = path.join(__dirname, '../content');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const TEST_CATEGORIES = {
  UNIT: 'unit-tests',
  INTEGRATION: 'integration-tests',
  E2E: 'e2e-tests',
  COMMON: 'common-patterns',
};

const DIRECTORY_CATEGORY_MAP = {
  'direct-imports': TEST_CATEGORIES.UNIT,
  'indirect-dependencies': TEST_CATEGORIES.UNIT,
  'same-package': TEST_CATEGORIES.UNIT,
  'test-doubles': TEST_CATEGORIES.UNIT,
  
  'react-specific': TEST_CATEGORIES.INTEGRATION,
  'dynamic-imports': TEST_CATEGORIES.INTEGRATION,
  'lazy-loaded-components': TEST_CATEGORIES.INTEGRATION,
  
  'accessibility-testing': TEST_CATEGORIES.E2E,
  'async-testing': TEST_CATEGORIES.E2E,
  'nodejs-testing': TEST_CATEGORIES.E2E,
};

function extractExamplesFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const dirName = path.basename(path.dirname(filePath));
  const relativePath = path.relative(EXAMPLES_DIR, filePath);

  const jsdocComments = content.match(/\/\*\*[\s\S]*?\*\//g) || [];
  const description = jsdocComments.length > 0
    ? jsdocComments[0].replace(/\/\*\*|\*\//g, '').replace(/\s*\*\s*/g, ' ').trim()
    : '';

  const isTestFile = fileName.includes('.test.') || fileName.includes('.spec.');
  
  let codeBlocks = [];
  
  if (isTestFile) {
    const testCaseRegex = /(?:it|test)\s*\(\s*['"](.+?)['"]\s*,\s*(?:async\s*)?\(\s*.*?\s*\)\s*=>\s*{([\s\S]*?)}\s*\)/g;
    let match;
    while ((match = testCaseRegex.exec(content)) !== null) {
      codeBlocks.push({
        title: match[1],
        code: match[0],
        type: 'test-case',
      });
    }
    
    const describeRegex = /describe\s*\(\s*['"](.+?)['"]\s*,\s*\(\s*\)\s*=>\s*{([\s\S]*?)}\s*\)/g;
    while ((match = describeRegex.exec(content)) !== null) {
      codeBlocks.push({
        title: match[1],
        code: match[0],
        type: 'describe-block',
      });
    }
  } else {
    const functionRegex = /(?:export\s+)?(?:function|const)\s+(\w+)\s*(?:=\s*(?:async\s*)?\([\s\S]*?\)\s*=>|[\s\S]*?\([\s\S]*?\)\s*{)[\s\S]*?(?:}|\);)/g;
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
      codeBlocks.push({
        title: match[1],
        code: match[0],
        type: 'function',
      });
    }
    
    const classRegex = /(?:export\s+)?(?:class|interface|type)\s+(\w+)[\s\S]*?{[\s\S]*?}/g;
    while ((match = classRegex.exec(content)) !== null) {
      codeBlocks.push({
        title: match[1],
        code: match[0],
        type: 'class',
      });
    }
  }
  
  if (codeBlocks.length === 0) {
    codeBlocks.push({
      title: fileName,
      code: content,
      type: 'file',
    });
  }

  return {
    path: filePath,
    relativePath,
    fileName,
    dirName,
    content,
    description: description || `Example from ${fileName}`,
    isTestFile,
    category: DIRECTORY_CATEGORY_MAP[dirName] || TEST_CATEGORIES.UNIT,
    codeBlocks,
  };
}

function getAllFiles(dir) {
  const files = [];

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      files.push(...getAllFiles(itemPath));
    } else if (stats.isFile() && (itemPath.endsWith('.ts') || itemPath.endsWith('.tsx'))) {
      files.push(itemPath);
    }
  }

  return files;
}

function extractCommonPatterns(examples) {
  const commonPatterns = [];
  
  const typeSafetyExamples = examples.filter(example => 
    example.content.includes('MockedFunction') || 
    example.content.includes('vi.mocked')
  );
  
  if (typeSafetyExamples.length > 0) {
    commonPatterns.push({
      title: 'Type Safety with MockedFunction',
      description: 'Using TypeScript to ensure type safety in mocks',
      examples: typeSafetyExamples.map(e => ({
        fileName: e.fileName,
        dirName: e.dirName,
        path: e.relativePath,
      })),
    });
  }
  
  const spyAssertionExamples = examples.filter(example => 
    example.content.includes('expect(') && 
    (example.content.includes('.toHaveBeenCalled') || 
     example.content.includes('.toBeCalledWith'))
  );
  
  if (spyAssertionExamples.length > 0) {
    commonPatterns.push({
      title: 'Spy Assertions',
      description: 'Verifying function calls with spy assertions',
      examples: spyAssertionExamples.map(e => ({
        fileName: e.fileName,
        dirName: e.dirName,
        path: e.relativePath,
      })),
    });
  }
  
  const mockImplementationExamples = examples.filter(example => 
    example.content.includes('.mockImplementation') || 
    example.content.includes('.mockReturnValue')
  );
  
  if (mockImplementationExamples.length > 0) {
    commonPatterns.push({
      title: 'Mock Implementation',
      description: 'Providing custom implementations for mocked functions',
      examples: mockImplementationExamples.map(e => ({
        fileName: e.fileName,
        dirName: e.dirName,
        path: e.relativePath,
      })),
    });
  }
  
  return commonPatterns;
}

function extractAllExamples() {
  if (!fs.existsSync(EXAMPLES_DIR)) {
    console.error(`Examples directory not found: ${EXAMPLES_DIR}`);
    return;
  }

  const files = getAllFiles(EXAMPLES_DIR);
  const examples = files.map(extractExamplesFromFile);

  const examplesByCategory = {
    [TEST_CATEGORIES.UNIT]: [],
    [TEST_CATEGORIES.INTEGRATION]: [],
    [TEST_CATEGORIES.E2E]: [],
    [TEST_CATEGORIES.COMMON]: [],
  };

  examples.forEach(example => {
    examplesByCategory[example.category].push(example);
  });
  
  const commonPatterns = extractCommonPatterns(examples);
  examplesByCategory[TEST_CATEGORIES.COMMON] = commonPatterns;

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  Object.entries(examplesByCategory).forEach(([category, categoryExamples]) => {
    const outputPath = path.join(OUTPUT_DIR, `${category}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(categoryExamples, null, 2));
    
    const publicPath = path.join(__dirname, '../public/content', `${category}.json`);
    fs.writeFileSync(publicPath, JSON.stringify(categoryExamples, null, 2));
    
    console.log(`Wrote ${categoryExamples.length} examples to ${outputPath} and ${publicPath}`);
  });

  const indexData = JSON.stringify({
    categories: Object.keys(examplesByCategory),
    totalExamples: examples.length,
    examplesByCategory: Object.fromEntries(
      Object.entries(examplesByCategory).map(([category, examples]) => [
        category,
        Array.isArray(examples) ? examples.map(example => {
          if (example.fileName) {
            return {
              fileName: example.fileName,
              dirName: example.dirName,
              description: example.description,
              isTestFile: example.isTestFile,
              path: example.relativePath,
            };
          } else {
            return example; // For common patterns
          }
        }) : examples
      ])
    ),
  }, null, 2);
  
  const indexPath = path.join(OUTPUT_DIR, 'index.json');
  fs.writeFileSync(indexPath, indexData);
  
  const publicIndexPath = path.join(__dirname, '../public/content', 'index.json');
  fs.writeFileSync(publicIndexPath, indexData);
  
  console.log(`Wrote index file to ${indexPath} and ${publicIndexPath}`);
}

extractAllExamples();

console.log('Example extraction complete!');
