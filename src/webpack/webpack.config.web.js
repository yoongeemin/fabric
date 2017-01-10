/**
 * App configuration
 */
import webpack from "webpack"
import { join, resolve } from "path"
import { env, merger, isTest, isDev, isProd } from "./lib"
import base from "./webpack.config.base"

const APP_PATH    = resolve(__dirname, "../app")
const CONFIG_PATH = resolve(__dirname, "../config")
const NODE_PATH   = resolve(__dirname, "../../node_modules")
const COMMON_VENDORS = [
    "axios",
    "bluebird",
    "immutable",
    "lodash",
    "moment",
    "react",
    "react-dom",
    "react-redux",
    "react-router",
    "react-router-redux",
    "redux",
    "redux-immutable",
    "redux-saga",
]

/**
 * Web configuration builder
 */
const app = () => {
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
     * Add APP directory to Babel include path
     */
    config.module.rules[0].include.push(APP_PATH)

    if (isTest()) {
        /**
         * Enzyme support for React testing
         */
        config = merger({
            externals: {
                "cheerio": "window",
                "react/addons": true,
                "react/lib/ExecutionEnvironment": true,
                "react/lib/ReactContext": true,
            },
        }, config)

        /**
         * Mock React Native
         */
        config.resolve.alias["react-native"] = join(NODE_PATH, "react-native-mock/mock")

        /**
         * Limit test chunk size to 1
         */
        config.plugins.push(new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }))
    }

    else {
        config.entry = { app: ["app/web/client.web.js"], vendor: COMMON_VENDORS }

        /**
         * Common chunks
         */
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({ names: ["vendor", "manifest"] })
        )

        /**
         * Linter configuration
         */
        loaderOptionsConfig.options.eslint = {
            configFile: join(CONFIG_PATH, "lint/.eslintrc.app")
        }
        config.module.rules.push({
            enforce: "pre",
            test: /\.jsx?/,
            loader: "eslint-loader",
            include: APP_PATH,
            exclude: [NODE_PATH],
        })
    }

    /**
     * Hot module replacement
     */
    if (isDev()) {
        const ENV = env()
        const DEV_SERVER = `${ENV.WDS_PROTOCOL}://${ENV.WDS_HOST}:${ENV.WDS_PORT}`
        config.entry.app.push("react-hot-loader/patch")
        config.entry.app.push("webpack/hot/only-dev-server")
        config.entry.app.push(`webpack-dev-server/client?${DEV_SERVER}/`)
        config.output.publicPath = `${DEV_SERVER}/build/`

        config.plugins.push(
            new webpack.HotModuleReplacementPlugin()
        )

        /**
         * Add React Hot Babel loader
         */
        config.module.rules[0].loaders.unshift("react-hot-loader/webpack")
    }

    /**
     * Apply loader options configuration
     */
    config.plugins.push(
        new webpack.LoaderOptionsPlugin(loaderOptionsConfig)
    )

    return config
}

export default app
