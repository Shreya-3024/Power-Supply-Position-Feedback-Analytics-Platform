#!/bin/bash

# Cleanup Script for TypeScript Files
# Run this AFTER verifying all JSX files work correctly
# Usage: bash cleanup-typescript-files.sh

echo "🧹 TypeScript Files Cleanup Script"
echo "===================================="
echo ""
echo "⚠️  WARNING: This will DELETE all original TypeScript files!"
echo "Make sure you've tested the JSX versions first."
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Cleanup cancelled."
    exit 0
fi

echo ""
echo "🗑️  Deleting TypeScript component files..."

# Delete component TSX files
rm -f /components/AdminLogin.tsx
rm -f /components/AdminPanel.tsx
rm -f /components/ComplaintCard.tsx
rm -f /components/ComplaintForm.tsx
rm -f /components/Dashboard.tsx
rm -f /components/Footer.tsx
rm -f /components/Navbar.tsx
rm -f /components/StatCard.tsx
rm -f /components/StatusBadge.tsx
rm -f /components/Timeline.tsx
rm -f /components/TrackComplaints.tsx
rm -f /components/WelcomePage.tsx

echo "✅ Component TSX files deleted"

# Delete utility TS files
rm -f /components/ui/use-mobile.ts
rm -f /components/ui/utils.ts
rm -f /utils/api.ts

echo "✅ Utility TS files deleted"

# Delete App.tsx
rm -f /App.tsx

echo "✅ App.tsx deleted"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Summary:"
echo "  - Deleted 13 component .tsx files"
echo "  - Deleted 3 utility .ts files"
echo "  - Deleted 1 App.tsx file"
echo ""
echo "✨ Your project is now pure JavaScript!"
echo ""
echo "📌 Optional next steps:"
echo "  1. Remove TypeScript from package.json devDependencies"
echo "  2. Remove or rename tsconfig.json"
echo "  3. Test your app with: npm run dev"
