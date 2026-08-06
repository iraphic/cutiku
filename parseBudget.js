const ts = require('typescript');
const fs = require('fs');
const path = './src/components/Budget.tsx';
const text = fs.readFileSync(path, 'utf8');
const sourceFile = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram({rootNames:[path], options:{jsx:'preserve', allowJs:false, target:ts.ScriptTarget.ES2020, module:ts.ModuleKind.ESNext}}));
console.log('count', diagnostics.length);
diagnostics.forEach(d=>{
  if (d.file){
    const pos = d.file.getLineAndCharacterOfPosition(d.start);
    console.log(`${pos.line+1}:${pos.character+1} ${ts.flattenDiagnosticMessageText(d.messageText,'\n')}`);
  } else {
    console.log(ts.flattenDiagnosticMessageText(d.messageText,'\n'));
  }
});
