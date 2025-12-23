#!/usr/bin/env node

/**
 * Script to convert all TypeScript files (.tsx, .ts) to JavaScript (.jsx, .js)
 * Run with: node convert-tsx-to-jsx.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files and directories to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  'backend',
  'ImageWithFallback.tsx', // Protected file
  'convert-tsx-to-jsx.js',
  'convert-to-jsx.sh'
];

/**
 * Remove TypeScript syntax from code
 */
function removeTypeScript(content) {
  let result = content;

  // Remove interface declarations
  result = result.replace(/^interface\s+\w+\s*\{[^}]*\}/gm, '');
  
  // Remove type declarations
  result = result.replace(/^type\s+\w+\s*=\s*[^;]+;/gm, '');
  
  // Remove import type statements
  result = result.replace(/^import\s+type\s+.*$/gm, '');
  
  // Remove type annotations from function parameters
  result = result.replace(/(\w+):\s*[A-Za-z<>|&\[\]{}(), ]+(\)|\s*=|\s*,|\s*\{)/g, '$1$2');
  
  // Remove type annotations from variable declarations
  result = result.replace(/const\s+(\w+):\s*[A-Za-z<>|&\[\]{}(), ]+\s*=/g, 'const $1 =');
  result = result.replace(/let\s+(\w+):\s*[A-Za-z<>|&\[\]{}(), ]+\s*=/g, 'let $1 =');
  
  // Remove generic type parameters
  result = result.replace(/<[A-Za-z<>|&\[\]{}(), ]+>(?=\()/g, '');
  
  // Remove return type annotations
  result = result.replace(/\):\s*[A-Za-z<>|&\[\]{}(), ]+\s*=>/g, ') =>');
  result = result.replace(/function\s+(\w+)\([^)]*\):\s*[A-Za-z<>|&\[\]{}(), ]+\s*\{/g, 'function $1() {');
  
  // Remove as type assertions
  result = result.replace(/\s+as\s+[A-Za-z<>|&\[\]{}(), ]+/g, '');
  
  // Remove non-null assertions
  result = result.replace(/(\w+)!/g, '$1');
  
  // Clean up empty lines (more than 2 consecutive)
  result = result.replace(/\n\n\n+/g, '\n\n');
  
  return result;
}

/**
 * Check if file should be skipped
 */
function shouldSkip(filePath) {
  return SKIP_PATTERNS.some(pattern => filePath.includes(pattern));
}

/**
 * Convert a single file
 */
function convertFile(filePath) {
  const ext = path.extname(filePath);
  if (ext !== '.tsx' && ext !== '.ts') return;
  
  const newExt = ext === '.tsx' ? '.jsx' : '.js';
  const newPath = filePath.replace(new RegExp(`\\${ext}$`), newExt);
  
  console.log(`Converting: ${path.relative(__dirname, filePath)} → ${path.relative(__dirname, newPath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const converted = removeTypeScript(content);
    fs.writeFileSync(newPath, converted, 'utf8');
    console.log(`✅ Created: ${path.relative(__dirname, newPath)}`);
  } catch (error) {
    console.error(`❌ Error converting ${filePath}:`, error.message);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldSkip(fullPath)) {
      console.log(`⏭️  Skipping: ${path.relative(__dirname, fullPath)}`);
      continue;
    }
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (ext === '.tsx' || ext === '.ts') {
        convertFile(fullPath);
      }
    }
  }
}

/**
 * Main function
 */
function main() {
  console.log('🔄 Starting TypeScript to JavaScript conversion...\n');
  
  const rootDir = __dirname;
  
  // Process specific directories
  const dirsToProcess = [
    path.join(rootDir, 'components'),
    path.join(rootDir, 'utils'),
    rootDir // For root level files like App.tsx
  ];
  
  for (const dir of dirsToProcess) {
    if (fs.existsSync(dir)) {
      if (dir === rootDir) {
        // Only process specific files in root
        const rootFiles = ['App.tsx'];
        for (const file of rootFiles) {
          const filePath = path.join(rootDir, file);
          if (fs.existsSync(filePath)) {
            convertFile(filePath);
          }
        }
      } else {
        processDirectory(dir);
      }
    }
  }
  
  console.log('\n✅ Conversion complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Update package.json to remove TypeScript dependencies');
  console.log('2. Remove or rename tsconfig.json');
  console.log('3. Update vite.config to use JSX instead of TSX');
  console.log('4. Test your application: npm run dev');
  console.log('5. Delete old .tsx and .ts files after verification');
}

// Run the conversion
main();
