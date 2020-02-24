
# script pattern factory

Simple tool for creating AST patterns from JavaScript code

## API

#### SPF.parse (source, opts)
Traverse source code and returns its AST pattern 
- `source` (string)
-  `opts` (object) - optional
	- `input` (object) 
		- `minify` (boolean/opts) [uglify-js  minify configuration](https://www.npmjs.com/package/uglify-js#api-reference). if `true` the source will be minified using the default configuration (`UglifyJS.minify(code);`) 
	- `parse` (object) [meriyah parsing API](https://github.com/meriyah/meriyah#api)
	- `output` (object)
		- `raw` (boolean) return raw nodes
		- `compressed`(boolean) return compressed pattern (e.g `VVVVV` -> `V5`)
		- `map` (object) override [AST nodes mapping](https://github.com/bgauryy/ScriptPatternFactory/blob/master/src/constants.js)

#### SPF.inspect()
returns the [AST nodes mapping](https://github.com/bgauryy/ScriptPatternFactory/blob/master/src/constants.js)

## AST Nodes Mapping
```json
 {
	  Program: '',
	  FunctionDeclaration: 'F',
	  VariableDeclaration: 'V',
	  VariableDeclarator: 'v',
	  BlockStatement: 'B',
	  Identifier: 'I',
	  ExpressionStatement: 'E',
	  CallExpression: 'C',
	  ThisExpression: 'd',
	  Literal: 'e',
	  EmptyStatement: 'h',
	  DebuggerStatement: 'i',
	  WithStatement: 'j',
	  ReturnStatement: 'k',
	  LabeledStatement: 'l',
	  BreakStatement: 'm',
	  ContinueStatement: 'n',
	  IfStatement: 'o',
	  SwitchStatement: 'p',
	  SwitchCase: 'q',
	  ThrowStatement: 'r',
	  TryStatement: 's',
	  CatchClause: 't',
	  WhileStatement: 'u',
	  DoWhileStatement: 'c',
	  ForStatement: 'w',
	  ForInStatement: 'x',
	  Property: 'z',
	  ArrayExpression: 'A',
	  ObjectExpression: 'b',
	  FunctionExpression: 'P',
	  UnaryExpression: 'D',
	  UnaryOperator: 'g',
	  UpdateExpression: 'a',
	  UpdateOperator: 'G',
	  BinaryExpression: 'H',
	  BinaryOperator: 'f',
	  AssignmentExpression: 'J',
	  AssignmentOperator: 'K',
	  LogicalExpression: 'L',
	  LogicalOperator: 'M',
	  MemberExpression: 'N',
	  ConditionalExpression: 'O',
	  NewExpression: 'Q',
	  SequenceExpression: 'R',
}
``` 

## Example

 ````javascript
const SPF = require('script-pattern-factory');

(async function () {
    const code = `
    const x = 10;
    function foo(val){
        console.log(val);
    }
    foo(x);
    
    const y = 55;
    `;
    const pattern = await SPF.getPattern(code);
    //VvIFBECNIECIVvI
    console.log(`Pattern ${pattern}`);
    console.log(`Symbol Map:\n${JSON.stringify(SPF.inspect())}`);
})();
````



