#!/usr/bin/env node

/**
 * Verification Script for TypeScript to JavaScript Conversion
 * Run with: node verify-conversion.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 TypeScript to JavaScript Conversion Verification\n');
console.log('=' .repeat(60));

const results = {
  total: 0,
  converted: 0,
  missing: 0,
  errors: []
};

// Files that should exist after conversion
const expectedFiles = [
  // Component files
  { tsx: 'components/AdminLogin.tsx', jsx: 'components/AdminLogin.jsx' },
  { tsx: 'components/AdminPanel.tsx', jsx: 'components/AdminPanel.jsx' },
  { tsx: 'components/ComplaintCard.tsx', jsx: 'components/ComplaintCard.jsx' },
  { tsx: 'components/ComplaintForm.tsx', jsx: 'components/ComplaintForm.jsx' },
  { tsx: 'components/Dashboard.tsx', jsx: 'components/Dashboard.jsx' },
  { tsx: 'components/Footer.tsx', jsx: 'components/Footer.jsx' },
  { tsx: 'components/StatCard.tsx', jsx: 'components/StatCard.jsx' },
  { tsx: 'components/StatusBadge.tsx', jsx: 'components/StatusBadge.jsx' },
  { tsx: 'components/Timeline.tsx', jsx: 'components/Timeline.jsx' },
  { tsx: 'components/TrackComplaints.tsx', jsx: 'components/TrackComplaints.jsx' },
  { tsx: 'components/WelcomePage.tsx', jsx: 'components/WelcomePage.jsx' },
  
  // Utility files
  { tsx: 'components/ui/use-mobile.ts', jsx: 'components/ui/use-mobile.js' },
  { tsx: 'components/ui/utils.ts', jsx: 'components/ui/utils.js' },
];

// Already existing files
const existingFiles = [
  'App.jsx',
  'components/Navbar.jsx',
  'utils/api.js'
];

console.log('\n📋 Checking converted files...\n');

expectedFiles.forEach(({ tsx, jsx }) => {
  results.total++;
  const jsxPath = path.join(__dirname, jsx);
  
  if (fs.existsSync(jsxPath)) {
    console.log(`✅ ${jsx}`);
    results.converted++;
    
    // Check for TypeScript syntax that shouldn't be in JSX
    const content = fs.readFileSync(jsxPath, 'utf8');
    const hasInterface = content.includes('interface ');
    const hasTypeAnnotation = /:\s*(string|number|boolean|any)\s*[=,)]/.test(content);
    
    if (hasInterface || hasTypeAnnotation) {
      console.log(`   ⚠️  Warning: May contain TypeScript syntax`);
      results.errors.push(`${jsx} may contain TypeScript syntax`);
    }
  } else {
    console.log(`❌ ${jsx} - MISSING`);
    results.missing++;
    results.errors.push(`${jsx} is missing`);
  }
});

console.log('\n📋 Checking existing files...\n');

existingFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    results.errors.push(`${file} is missing`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('\n📊 Conversion Summary:\n');
console.log(`   Total files to convert: ${results.total}`);
console.log(`   ✅ Successfully converted: ${results.converted}`);
console.log(`   ❌ Missing: ${results.missing}`);

if (results.errors.length > 0) {
  console.log('\n⚠️  Issues found:\n');
  results.errors.forEach(error => {
    console.log(`   - ${error}`);
  });
} else {
  console.log('\n✨ All files converted successfully!');
}

console.log('\n' + '='.repeat(60));

if (results.missing === 0 && results.errors.length === 0) {
  console.log('\n✅ Conversion Complete! Your app is ready to run.');
  console.log('\n📝 Next steps:');
  console.log('   1. Test your app: npm run dev');
  console.log('   2. Once verified, run: bash cleanup-typescript-files.sh');
  console.log('   3. Remove TypeScript from package.json if desired');
} else {
  console.log('\n❌ Conversion incomplete. Please check the issues above.');
  process.exit(1);
}

console.log('');
