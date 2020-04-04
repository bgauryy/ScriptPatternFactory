const Terser = require('terser');
const {traversSourceCode, symbolMap, getNodeSymbol} = require('./ast');

/**
 * @param source {string}
 * @param input {object}
 *      minify {boolean/object},  https://github.com/terser/terser#minify-options
 * @param parse {object} https://github.com/meriyah/meriyah#api
 * @param output
 * @return {Promise<*|void|string>}
 */
async function createPattern(source, {input, parse, output}) {
    source = getSource(source, input);
    const nodes = await traversSourceCode(source, parse);
    return parseNodes(nodes, output);
}

function getSource(source, opts) {
    if (opts.minify) {
        const minifyOpts = (typeof opts.minify === 'object') ? opts.minify : undefined;
        const result = Terser.minify(source, minifyOpts);
        if (result.error) {
            throw result.error;
        }
        source = result.code;
    }
    return source;
}

function parseNodes(nodes, opts) {
    if (opts.raw) {
        return nodes;
    }
    let pattern = '';
    for (let i = 0; i < nodes.length; i++) {
        pattern += getNodeSymbol(nodes[i], opts.map);
    }
    if (opts.compressed) {
        return compressPattern(pattern);
    }
    return pattern;
}

function compressPattern(pattern) {
    const keys = Object.values(symbolMap);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i]) {
            const regex = new RegExp(`${keys[i]}{3,}`, 'g');
            let match = regex.exec(pattern);
            do {
                if (match && match[0]) {
                    pattern = pattern.replace(new RegExp(match[0], 'g'), `${keys[i]}${match[0].length}`);
                }
                match = regex.exec(pattern);
            } while (match);
        }
    }
    return pattern;
}

module.exports = {
    createPattern
};
