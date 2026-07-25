const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir);

let updated = 0;

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('import rccgLogo from "@/assets/rccg-logo.png";')) {
    const matches = content.match(/rccgLogo/g);
    if (matches && matches.length === 1) {
      content = content.replace(/^import rccgLogo from \"@\/assets\/rccg-logo\.png\";\r?\n/m, '');
      fs.writeFileSync(filePath, content);
      updated++;
      console.log('Cleaned ' + file);
    }
  }
}
console.log('Total cleaned: ' + updated);
