/**
 * Webpack library
 */

import _ from "lodash"
import { resolve } from "path"
import { readdirSync } from "fs"
import { all } from "bluebird"
import { argv } from "yargs"

/**
 * Recursively deepmerge objects
 * @param {Object} obj - Object
 * @param {Object} src - Source
 * @returns {Object} Merged object
 */
const merge = (obj, src) => {
    if (_.isArray(obj) && _.isArray(src)) return _.concat(src, obj)
    if (_.isObject(obj) && _.isObject(src)) return _.assignInWith(obj, src, merge)
    return _.isUndefined(obj) ? src : obj
}

/**
 * Deepmerge objects
 * @param obj - Object
 * @param src - Source
 * @returns {Object} Merged object
 */
export const merger = (obj, src) => _.assignInWith(_.cloneDeep(obj), src, merge)

/**
 * Inject environment variables into webpack.config
 * @param {Object} env - Environment
 */
export const injector = (env) =>
    _.reduce(env, (result, value, key) => {
        result[`process.env.${key}`] = JSON.stringify(value)
        return result
    }, { })

/**
 * Node externals
 * @param {String} modulesPath
 * @returns {Object} Node externals
 */
export const nodeExternals = (modulesPath) => {
    const modules = readdirSync(modulesPath).filter((x) => [".bin"].indexOf(x) === -1)
    return _.reduce(
        modules,
        (externals, module) => _.assign(externals, { [module]: `commonjs ${module}` }),
        {}
    )
}

/**
 * Check test environment
 * @returns {boolean} Is test environment
 */
export const isTest = () => {
    return (argv.env === "TEST")
}

/**
 * Check dev environment
 * @returns {boolean} Is dev environment
 */
export const isDev = () => {
    return (argv.env === "DEV")
}

/**
 * Check prod environment
 * @returns {boolean} Is prod environment
 */
export const isProd = () => {
    return (argv.env === "PROD")
}

/**
 * Get environment variables
 * @returns {Object} JSON object
 */
export const env = () => {
    return require(resolve(__dirname, `../config/env/${argv.env}.json`))
}
