# Scripts Signatures Factory

Creates patterns from JS scripts

## API

#### Parse

Traverse code and returns its AST pattern 

#### Inspect

Returns pattern symbols map
 
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



