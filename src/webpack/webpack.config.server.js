/**
 * Server configuration
 */
import webpack from "webpack"
import { join, resolve } from "path"
import { isTest, isProd, merger, nodeExternals } from "./lib"
import base from "./webpack.config.base"

const APP_PATH     = resolve(__dirname, "../app")
const SERVER_PATH  = resolve(__dirname, "../server")
const CONFIG_PATH  = resolve(__dirname, "../config")
const NODE_PATH    = resolve(__dirname, "../../node_modules")

/**
 * Server configuration builder
 */
const server = () => {
    /**
     * Base configuration
     */
    let config = base()

    /**
     * Loader options configuration
     */
    const loaderOptionsConfig = {
        debug: !isProd(),
        minimize: isProd(),
        options: {},
    }

    /**
     * Node configuration
     */
    config = merger({
        target: "node",

        node: {
            console:    false,
            global:     false,
            process:    false,
            Buffer:     false,
            __dirname:  true,
            __filename: true,
        },

        output: {
            libraryTarget: "commonjs2",
        },

        externals: [nodeExternals(NODE_PATH)],
    }, config)

    /**
     * Add SERVER and rendering directories to Babel include path
     */
    config.module.rules[0].include.push(SERVER_PATH)
    config.module.rules[0].include.push(join(APP_PATH, "web"))

    /**
     * Limit server chunk size to 1
     */
    config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))

    if (isTest()) {
        config.entry = { test: ["../test/server/index.js"] }
    }
    else {
        config.entry = { server: ["server/instances/server.js"] }

        /**
         * Linter configuration
         */
        loaderOptionsConfig.options.eslint = {
            configFile: join(CONFIG_PATH, "lint/.eslintrc.server")
        }
        config.module.rules.push({
            enforce: "pre",
            test: /\.jsx?/,
            loader: "eslint-loader",
            include: SERVER_PATH,
            exclude: [NODE_PATH],
        })
    }

    /**
     * Apply loader options configuration
     */
    config.plugins.push(
        new webpack.LoaderOptionsPlugin(loaderOptionsConfig)
    )

    return config
}

export default server
