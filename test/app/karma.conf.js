import web from "../../src/webpack/webpack.config.web"
import { argv } from "yargs"

module.exports = function(config) {
    const CONFIG = {
        basePath: "",

        frameworks: ["mocha"],

        files: [
            "index.js",
        ],

        /**
         * Webpack config
         */
        webpack: web(),
        webpackMiddleware: {
            stats: "errors-only",
            chunkModules: false,
            noInfo: true,
        },
        preprocessors: {
            "index.js": ["webpack", "sourcemap"],
        },

        /**
         * Reporter config
         */
        reporters: ["progress", "mocha"],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        browsers: ["Chrome"],

        singleRun: true,

        concurrency: Infinity
    }

    /**
     * Add coverage reporter
     */
    if (argv.coverage) {
        CONFIG.files.push({
            pattern: "../../src/app/**/*.js",
            watched: false,
            included: false,
            served: true,
            nocache: true,
        })

        CONFIG.reporters.push("coverage")

        CONFIG.coverageReporter = {
            dir : "../report/app/",
            subdir: ".",
            reporters: [
                { type: "lcov" },
                { type: "text-summary" },
            ],
        }
    }

    config.set(CONFIG)
}
