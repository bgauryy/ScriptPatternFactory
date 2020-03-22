const AST = require('abstract-syntax-tree');
const { symbolMap } = require('./constants');

/**
 * 
 * @param {string} source - The source code to traverse
 * @param {Object} parse - The parsing options for the AST parser
 * @param {Object} opts - Additional traversal options
 */
function traversSourceCode(source, parse, opts) {
    const root = AST.parse(source, parse);
    const getLinesContent = sourceGetter(source);
    const nodes = [];
    let stack = [root];

    return new Promise(resolve => {
        (async function getDFS() {
            const node = stack.shift();
            if (!node) {
                return resolve(nodes);
            }
            if (node.src === undefined) {
                node.src = node.loc ? getLinesContent(node.loc) : '';
            }
            const { nodeChildren, attrs } = getChildrenArray(node);
            const children = [];
            if (node.type !== 'Program') {
                if (!opts.keepAttrs) {
                    for (const attr of attrs) {
                        delete node[attr];
                    }
                }
                nodes.push(node);
            }
            if (nodeChildren) {
                for (let i = 0; i < nodeChildren.length; i++) {
                    const nodeChild = nodeChildren[i];
                    nodeChild.src = nodeChild.loc ? getLinesContent(nodeChild.loc) : '';
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

/**
 * Returns an instance of getCodeFromSourceLines for a specific source, saving the repeated line splits overhead.
 * @param {string} source - The source code to extract lines from
 */
function sourceGetter(source) {
    // Wrapper for getLinesFromSource to avoid splitting the same source repeatedly
    const sourceSplitLines = source.split('\n');
    return function ({ start, end }) {
        return getCodeFromSourceLines(start, end, sourceSplitLines);
    };
}

/**
 * Returns the code between the start and end locations in the source.
 * @param {Object} start - The starting line and column of the requested source
 * @param {Object} end - The ending line and column of the requested source
 * @param {Array} sourceLines - The source code split into lines
 */
function getCodeFromSourceLines(start, end, sourceLines) {
    // Retrieve the source of the node
    let src = null;
    try {
        if (start.line < end.line) {
            const relevantLines = sourceLines.slice(start.line - 1, end.line);
            if (start.column > 0) relevantLines[0] = relevantLines[0].slice(start.column);
            const lastLine = relevantLines.length - 1;
            if (end.column < relevantLines[lastLine].length) relevantLines[lastLine] = relevantLines[lastLine].slice(0, end.column);
            src = relevantLines.join('\n');
        } else if (start.line === end.line) {
            src = sourceLines[start.line - 1].slice(start.column, end.column);
        }
    } catch (e) { }
    return src;
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
        }
    }
    return {
        nodeChildren: [].concat.apply([], children.filter(c => !!c)),
        attrs: attrs
    };
}

module.exports = {
    traversSourceCode,
    getNodeSymbol,
    symbolMap
};
