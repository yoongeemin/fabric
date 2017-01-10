/**
 * Base configuration
 */
import webpack from "webpack"
import ProgressBarPlugin from "progress-bar-webpack-plugin"
import { join, resolve } from "path"
import { env, injector, isTest, isDev, isProd } from "./lib"

const CONTEXT_PATH = resolve(__dirname, "..")
const APP_PATH     = resolve(__dirname, "../app")
const SERVER_PATH  = resolve(__dirname, "../server")
const TEST_PATH    = resolve(__dirname, "../../test")
const BUILD_PATH   = resolve(__dirname, "../../build")
const NODE_PATH    = resolve(__dirname, "../../node_modules")

/**
 * Base configuration builder
 */
const base = () => {
    const BABEL_QUERY  = {
        babelrc: false,
        plugins: [
            ["transform-runtime", {
                helpers: true,
                polyfill: true,
                regenerator: true,
                moduleName: "babel-runtime",
            }],
        ],
        presets: ["es2015", "stage-0", "react"],
    }

    /**
     * Add instrumenter in TEST environment
     */
    if (isTest()) {
        BABEL_QUERY.plugins.push("istanbul")
    }

    /**
     * Define plugin variables
     */
    const definitions = injector(env())
    definitions.__NATIVE__ = false

    const config = {
        context: CONTEXT_PATH,

        performance: {
            hints: isProd(),
        },

        resolve: {
            modules: ["node_modules", CONTEXT_PATH],
            descriptionFiles: ["package.json"],
            alias: {
                app:    APP_PATH,
                server: SERVER_PATH,
            },
            extensions: [".js", ".jsx", ".json"],
        },

        output: {
            filename:      "[name].js",
            path:          BUILD_PATH,
            publicPath:    "/build/",
            chunkFilename: "[chunkhash].js"
        },

        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    /**
                     * Babel include path is platform specific
                     */
                    include: [],
                    exclude: [NODE_PATH],
                    // loaders: [`babel-loader`],
                    loaders: [`babel-loader?${JSON.stringify(BABEL_QUERY)}`],
                },
                {
                    test: /\.json$/,
                    loaders: ["json-loader"]
                },
            ],
        },

        plugins: [
            new webpack.DefinePlugin(definitions),
            new webpack.NoErrorsPlugin(),
            new ProgressBarPlugin(),
        ],
    }

    if (isTest()) {
        /**
         * Inline sourcemap in TEST environment
         */
        config.devtool = "cheap-inline-source-map"

        /**
         * Add TEST directory to Babel include path
         */
        config.module.rules[0].include.push(TEST_PATH)
    }

    if (isDev()) {
        /**
         * Emit sourcemap in DEV environment
         */
        config.devtool = "source-map"
    }

    if (isProd()) {
        /**
         * Bundle optimization in PROD environment
         */
        config.plugins.push(new webpack.optimize.DedupePlugin())
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            beautify: false,
            comments: false,
            sourceMap: false,
            compress: { warnings: false },
        }))
    }

    return config
}

export default base
