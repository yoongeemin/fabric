import gulp from "gulp"
import nodemon from "gulp-nodemon"
import { log } from "gulp-util"
import { join, resolve } from "path"

const LOGGER = "NODEMON"
const BUILD_PATH = resolve(__dirname, "../build")

/***
 * Run Nodemon server
 * @param {String} script - Server script
 * @param {Array} watch - Nodemon watch paths
 */
const run = (script, watch) =>
    () => {
        // Change working directory to src
        process.chdir(resolve(__dirname, "../src"))
        nodemon({ script, watch })
            .on("start", () => {
                log(`[${LOGGER}] Starting server`)
            })
            .on("restart", () => {
                log(`[${LOGGER}] Restarting server`)
            })
            .on("exit", () => {
                log(`[${LOGGER}] Stopping server`)
            })
            .on("crash", () => {
                log(`[${LOGGER}] Server crashed`)
            })
    }


/**
 * Tasks
 */
gulp.task("run-dev", ["watch-server-dev"], run(
    join(BUILD_PATH, "server.js"),
    [join(BUILD_PATH, "server.js")]
))
