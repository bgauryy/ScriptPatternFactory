const AST = require('abstract-syntax-tree');
const {symbolMap} = require('./constants');

function traversSourceCode(source, parse) {
    const root = AST.parse(source, parse);
    const nodes = [];
    let stack = [root];

    return new Promise(resolve => {
        (async function getDFS() {
            const node = stack.shift();
            if (!node) {
                return resolve(nodes);
            }
            const {nodeChildren, prop} = getChildrenArray(node);
            const children = [];
            if (node.type !== 'Program') {
                delete node[prop];
                nodes.push(node);
            }
            if (nodeChildren) {
                for (let i = 0; i < nodeChildren.length; i++) {
                    children.push(nodeChildren[i]);
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
    let children = [];
    let prop = '';

    if (Array.isArray(node)) {
        children = node;
    } else if (node.body) {
        children = Array.isArray(node.body) ? node.body : [node.body];
        prop = 'body';
    } else if (node.properties) {
        children = node.properties;
        prop = 'properties';
    } else if (node.block) {
        children = node.block.body;
        prop = 'block';
    } else if (node.expression) {
        children = [node.expression];
        prop = 'expression';
    } else if (node.expressions) {
        children = node.expressions;
        prop = 'expressions';
    } else if (node.argument) {
        children = [node.argument];
        prop = 'argument';
    } else if (node.callee) {
        children = [node.callee];
        prop = 'callee';
    } else if (node.declarations) {
        children = node.declarations;
        prop = 'declarations';
    } else if (node.cases) {
        children = node.cases;
        prop = 'cases';
    } else if (node.consequent) {
        children = [node.consequent];
        prop = 'consequent';
    } else if (node.property) {
        children = [node.property];
        prop = 'property';
    } else if (node.id) {
        children = [node.id];
        prop = 'id';
    } else {
        //TODO: impl
    }
    return {
        nodeChildren: children,
        prop
    };
}

module.exports = {
    traversSourceCode,
    getNodeSymbol,
    symbolMap
};
