const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir);

const watermarkRegex = /\{\/\*\s*Background Watermark\s*\*\/\}\s*<div className=\"fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden\">\s*<img[^>]+rccgLogo[^>]+>\s*<\/div>/g;
const indexWatermarkRegex = /\{\/\*\s*Background Watermark\s*\*\/\}\s*<div className=\"fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden\">\s*<img[^>]+rccgLogo[^>]+>\s*<\/div>/g;

let updated = 0;

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('Background Watermark')) {
    // Replace the block
    content = content.replace(watermarkRegex, '<BackgroundWatermark />');
    
    // Add import if not present
    if (!content.includes('BackgroundWatermark')) {
      // Find the last import
      const importMatches = [...content.matchAll(/^import .*$/gm)];
      if (importMatches.length > 0) {
        const lastImportIndex = importMatches[importMatches.length - 1].index + importMatches[importMatches.length - 1][0].length;
        content = content.slice(0, lastImportIndex) + '\nimport BackgroundWatermark from "@/components/BackgroundWatermark";' + content.slice(lastImportIndex);
      }
    }
    
    fs.writeFileSync(filePath, content);
    updated++;
    console.log('Updated ' + file);
  }
}
console.log('Total files updated: ' + updated);
