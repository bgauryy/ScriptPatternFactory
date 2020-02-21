const {symbolMap} = require('./constants');
const {createPattern} = require('./pattern');

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

module.exports = {
    getPattern,
    inspect
};
