const fs = require('fs');
const path = 'menus.js';
const source = fs.readFileSync(path, 'utf8');

// 1. extract first string array and offset
const arrMatch = source.match(/function _0x282f\(\)\{var _0x40ea5e=\[(.*?)\];/s);
if (!arrMatch) {
  console.error('Array definition not found');
  process.exit(1);
}
const arrLiteral = '[' + arrMatch[1] + ']';
let stringArray;
try {
  stringArray = eval(arrLiteral);
} catch (e) {
  console.error('Failed to eval array:', e);
  process.exit(1);
}

// 2. find offset in mapping function (_0x4c43)
const offsetMatch = source.match(/_0x256eca=_0x256eca-(0x[0-9a-f]+)/);
const offset = offsetMatch ? parseInt(offsetMatch[1]) : 0;

// helper for decoding tokens
function decode(token) {
  const idx = parseInt(token, 16) - offset;
  return stringArray[idx] || token;
}

// replace occurrences like _0x5418d8(0x157)
let output = source.replace(/_0x[0-9a-fA-F]{5}\((0x[0-9a-fA-F]+)\)/g, (_, hex) => {
  const decoded = decode(hex);
  // wrap in quotes if looks like identifier or contains spaces
  return JSON.stringify(decoded);
});

// write result
fs.writeFileSync('menus.deobf.js', output);
console.log('Deobfuscated file written to menus.deobf.js');