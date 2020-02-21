const {getPattern, inspect} = require('../src/index');

(async function () {
    const code = `
    const x = 10;
    function foo(val){
        console.log(val);
    }
    foo(x);
    
    var y = 55;
    `;
    const pattern = await getPattern(code);
    console.log(`Pattern ${pattern}`); //VvIFBECNIECIVvI
    console.log(`Symbol Map:\n${JSON.stringify(inspect())}`);
})();




