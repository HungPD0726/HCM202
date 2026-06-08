const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'mindmap.json');

const phrases = [
  'Tư tưởng Hồ Chí Minh',
  'HCM202',
  'chủ nghĩa Mác - Lênin',
  'độc lập dân tộc',
  'chủ nghĩa xã hội',
  'Đảng Cộng sản Việt Nam',
  'Nhà nước của nhân dân, do nhân dân, vì nhân dân',
  'đại đoàn kết toàn dân tộc',
  'đoàn kết quốc tế',
  'văn hóa, đạo đức, con người',
  'cần, kiệm, liêm, chính, chí công vô tư'
];

function escapeRegex(str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function processDescription(value) {
  if (typeof value !== 'string') return value;

  let text = value.replace(/<\/?b>/gi, '').replace(/\r\n/g, '\n').replace(/\n\s*\n+/g, '\n\n');
  for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
    text = text.replace(new RegExp(escapeRegex(phrase), 'g'), '<b>$&</b>');
  }
  return text;
}

function traverse(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    value.forEach(traverse);
    return;
  }
  for (const key of Object.keys(value)) {
    if (key === 'description') value[key] = processDescription(value[key]);
    else traverse(value[key]);
  }
}

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  traverse(data);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Updated HCM202 emphasis in', filePath);
} catch (err) {
  console.error('Error processing file:', err.message);
  process.exit(1);
}
