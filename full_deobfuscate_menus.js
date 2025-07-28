const fs=require('fs');
const code=fs.readFileSync('menus.js','utf8');

// Helper to safely eval an array literal string
function safeEvalArray(str){
  return Function(`'use strict'; return (${str});`)();
}
// 1. collect array provider functions
const arrayFuncs={};
const arrayDeclRegex=/function\s+(_0x[0-9a-fA-F]{4})\s*\(\)\s*\{var\s+(_0x[0-9a-fA-F]+)\s*=\s*\[(.*?)\];/gs;
let m;
while((m=arrayDeclRegex.exec(code))!==null){
  const funcName=m[1];
  const arrContent='['+m[3]+']';
  try{
    arrayFuncs[funcName]=safeEvalArray(arrContent);
  }catch(e){console.error('Failed eval array for',funcName,e);
  }
}

// 2. collect mapping functions info {name, arrayFuncName, offset}
const mappers={};
// pattern: function _0x4c43(_0x1aaaee,_0x5e578d){var _0x3df770=_0x282f();return _0x4c43=function(_0x256eca,_0x353d8b){_0x256eca=_0x256eca-0x128;var _0x36b0b4=_0x3df770[_0x256eca];return _0x36b0b4;},_0x4c43(_0x1aaaee,_0x5e578d);}
const mapperRegex=/function\s+(_0x[0-9a-fA-F]{5})\s*\([^)]*\)\{var\s+_0x[0-9a-fA-F]+\s*=\s*(_0x[0-9a-fA-F]{4})\(\);[^]*?=_0x[0-9a-fA-F]+[\s\S]*?-(0x[0-9a-fA-F]+)/g;
while((m=mapperRegex.exec(code))!==null){
  const mapName=m[1];
  const arrFunc=m[2];
  const offset=parseInt(m[3]);
  if(arrayFuncs[arrFunc]){
    mappers[mapName]={array:arrayFuncs[arrFunc],offset};
  }
}

let output=code;
// 3. for each mapper, replace calls in code
for(const [mapName,{array,offset}] of Object.entries(mappers)){
  const callRegex=new RegExp(mapName+'\\((0x[0-9a-fA-F]+)\)','g');
  output=output.replace(callRegex,(match,hex)=>{
    const idx=parseInt(hex)-offset;
    const val=array[idx];
    if(val===undefined) return match;
    return JSON.stringify(val);
  });
}
fs.writeFileSync('menus.deobf2.js',output);
console.log('Finished full deobfuscation -> menus.deobf2.js');