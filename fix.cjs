const fs = require('fs');
const path = require('path');
const dir = 'src/pages';
const files = fs.readdirSync(dir);

let updated = 0;

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('<BackgroundWatermark />') && !content.includes('import BackgroundWatermark')) {
    content = 'import BackgroundWatermark from "@/components/BackgroundWatermark";\n' + content;
    fs.writeFileSync(filePath, content);
    updated++;
    console.log('Fixed ' + file);
  }
}
console.log('Total fixed: ' + updated);
