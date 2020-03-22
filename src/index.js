const {symbolMap} = require('./constants');
const {createPattern} = require('./pattern');
const { traversSourceCode } = require('./ast');

/**
 *
 * @param source {string}
 * @param opts {object}
 * @return {Promise<object>}
 */
async function getPattern(source, opts = {}) {
    opts.input = opts.input || {};
    opts.parse = opts.parse || {};
    opts.output = opts.output || {};
    return createPattern(source, opts);
}

function inspect() {
    const map = {};
    for (const prop in symbolMap) {
        if (Object.prototype.hasOwnProperty.call(symbolMap, prop)) {
            map[symbolMap[prop]] = prop;
        }
    }
    return {
        map
    };
}

/**
 * 
 * @param {string} source - The source code to extract node from
 * @param {Object} parse - The AST parsing options
 * @param {Object} opts - Additional traversal options
 */
async function getNodes(source, parse = {}, opts = {}) {
    parse.loc = parse.loc || true;              // Nodes location enables saving node's source along with node information
    opts.keepAttrs = opts.keepAttrs || false;   // Do not delete nodes' additional attributes
    return traversSourceCode(source, parse, opts);
}


module.exports = {
    getPattern,
    inspect,
    getNodes
};
