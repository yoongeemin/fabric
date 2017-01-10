/**
 * Webpack
 */

import gulp from "gulp"
import { join, resolve } from "path"
import { log, PluginError } from "gulp-util"
import webpack from "webpack"
import WebpackDevServer from "webpack-dev-server"
import web from "../src/webpack/webpack.config.web"
import server from "../src/webpack/webpack.config.server"
import DEV from "../src/config/env/DEV.json"

/**
 * Run Webpack compiler
 * @param {Function} builder - Webpack config builder
 */
const compile = (builder) =>
    (done) => {
        const config = builder()
        const compiler = webpack(config)
        return compiler.run(
            (err, stats) => {
                if (err) throw new PluginError(err.name, err.message)
                log(stats.toString({
                    colors: true,
                    chunks: false,
                }))
                done()
            })
    }

/**
 * Run Webpack compiler with watch
 * @param {Function} builder - Webpack config builder
 */
const watch = (builder) => {
    let initialCompile = true
    return (done) => {
        const config = builder()
        const compiler = webpack(config)
        compiler.watch(
            {
                aggregateTimeout: 1000,
                poll: 1000,
            },
            (err, stats) => {
                if (err) throw new PluginError(err.name, err.message)
                log(stats.toString("minimal"))
                if (initialCompile) {
                    initialCompile = false
                    done()
                }
            }
        )
    }
}

/**
 * Webpack dev server
 * @param {Function} builder - Webpack config builder
 */
const wds = (builder) =>
    (done) => {
        const config = builder()
        const compiler = webpack(config)
        const server = new WebpackDevServer(compiler, {
            publicPath: compiler.options.output.publicPath,
            historyApiFallback: true,
            hot: true,
            quiet: true,
            noInfo: true,
            watchOptions: {
                aggregateTimeout: 1000,
                poll: true,
            },
            proxy: {
                "/build": {
                    target: `${DEV.WDS_PROTOCOL}://${DEV.WDS_HOST}:${DEV.WDS_PORT}`,
                    secure: false,
                },
                "*": {
                    target: `${DEV.SERVER_PROTOCOL}://${DEV.SERVER_HOST}:${DEV.SERVER_PORT}`,
                    secure: false,
                },
            },
        })

        server.listen(DEV.WDS_PORT, DEV.WDS_HOST, (err) => {
            if (err) throw new PluginError(err.name, err.message)
            log(`Webpack Dev Server listening on port ${DEV.WDS_PORT}`)
            log(`Bundling ${compiler.options.output.filename}`)
        })

        let initialCompile = true;
        compiler.plugin("done", (stats) => {
            log(stats.toString("minimal"))
            if (initialCompile) {
                initialCompile = false
                done()
            }
        })
    }


/**
 * Tasks
 */
gulp.task("compile-app-dev",  compile(web))
gulp.task("compile-app-prod", compile(web))
gulp.task("dev-server-app",   wds(web))

gulp.task("compile-server-test", ["clean-test"],   compile(server))
gulp.task("compile-server-dev",  ["clean-server"], compile(server))
gulp.task("compile-server-prod", ["clean-server"], compile(server))

gulp.task("watch-server-dev",    ["clean-server", "dev-server-app"], watch(server))
