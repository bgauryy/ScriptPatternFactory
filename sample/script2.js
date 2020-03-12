const SPF = require('../src/index');

(async function () {
    const code = `
    const x = 10;
    function foo(val){
        console.log(val);
    }
    foo(x);
    ;
    const y = 55;
    `;
    const nodes = await SPF.getNodes(code);
    console.log(`Parsed ${nodes.length}:`);
    for (let node of nodes) {
        console.log(`[${node.type.padEnd(22)}] ==> ${node.src.replace('\n', '')}`);
    }
})();
