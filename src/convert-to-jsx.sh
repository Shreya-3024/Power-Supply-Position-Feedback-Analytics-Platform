#!/bin/bash

# Script to convert all .tsx files to .jsx and .ts files to .js
# This script will help convert TypeScript files to JavaScript

echo "🔄 Starting TypeScript to JavaScript conversion..."

# Function to convert a single file
convert_file() {
    local src_file="$1"
    local dest_file="${src_file%.tsx}.jsx"
    
    if [[ "$src_file" == *.ts ]]; then
        dest_file="${src_file%.ts}.js"
    fi
    
    echo "Converting: $src_file → $dest_file"
    
    # Remove TypeScript type annotations and interfaces
    sed -E \
        -e 's/: [A-Za-z<>|&\[\]{}(), ]+(\)| =|;|,|\{)/\1/g' \
        -e '/^interface /d' \
        -e '/^type /d' \
        -e '/^import type/d' \
        -e 's/<[A-Za-z]+>//g' \
        "$src_file" > "$dest_file"
}

# Convert all .tsx files in components directory
echo "\n📂 Converting component files..."
find components -name "*.tsx" -type f | while read file; do
    convert_file "$file"
done

# Convert all .ts files in utils directory  
echo "\n📂 Converting utility files..."
find utils -name "*.ts" -type f | while read file; do
    convert_file "$file"
done

# Convert App.tsx
if [ -f "App.tsx" ]; then
    echo "\n📂 Converting App.tsx..."
    convert_file "App.tsx"
fi

echo "\n✅ Conversion complete!"
echo "\n⚠️  Note: Please review the converted files and:"
echo "   1. Remove TypeScript configuration files if not needed"
echo "   2. Update imports in files to use .js/.jsx extensions if needed"
echo "   3. Test the application thoroughly"
