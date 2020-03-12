const AST = require('abstract-syntax-tree');
const {symbolMap} = require('./constants');

function traversSourceCode(source, parse) {
    const root = AST.parse(source, parse);
    const sourceLines = source.split('\n');
    const nodes = [];
    let stack = [root];

    function getSrc({start, end}) {
        // Retrieve the source of the node
        let src = null;
        try {
            if (start.line < end.line) {
                src = sourceLines[start.line - 1].substr(start.column);
                for (let i = start.line; i < end.line; i++) {
                    src += sourceLines[i] + '\n';
                }
            } else {
                src = sourceLines[start.line - 1].substr(start.column, end.column - start.column);
            }
        } catch (e) {

        }
        return src;
    }

    return new Promise(resolve => {
        (async function getDFS() {
            const node = stack.shift();
            if (!node) {
                return resolve(nodes);
            }
            if (node.src === undefined) {
                node.src = getSrc(node.loc);
            }
            const {nodeChildren, attrs} = getChildrenArray(node);
            const children = [];
            if (node.type !== 'Program') {
                for (const attr of attrs) {
                    delete node[attr];
                }
                nodes.push(node);
            }
            if (nodeChildren) {
                for (let i = 0; i < nodeChildren.length; i++) {
                    const nodeChild = nodeChildren[i];
                    nodeChild.src = getSrc(nodeChild.loc);
                    children.push(nodeChild);
                }
            }
            stack = children.concat(stack);
            //Avoid max stack exceptions
            Promise.resolve()
                .then(getDFS);
        })();
    });
}

function getNodeSymbol(node, customMap = {}) {
    const type = node.type;
    if (!type) {
        return '';
    }
    if (Object.prototype.hasOwnProperty.call(symbolMap, type)) {
        return customMap[type] || symbolMap[type];
    }
    throw new Error(type);
}

function getChildrenArray(node) {
    const children = [];
    const attrs = [];
    const ignoreAttrs = ['loc', 'src'];
    const ignoreTypes = ['EmptyStatement', 'Literal', 'Identifier', 'ThisExpression',
                         'ContinueStatement', 'BreakStatement'];
    const acceptableType = ['object', 'array'];
    if (!ignoreTypes.includes(node.type)) {
        for (const prop of Object.keys(node)) {
            if (acceptableType.includes(typeof node[prop]) && !ignoreAttrs.includes(prop)) {
                attrs.push(prop);
                children.push(node[prop]);
            }
        }}
    return {
        nodeChildren:  [].concat.apply([], children.filter(obj => obj !== null)),
        attrs: attrs
    };
}

module.exports = {
    traversSourceCode,
    getNodeSymbol,
    symbolMap
};
