/**
 * Clean
 */

import gulp from "gulp"
import { join, resolve } from "path"
import { sync } from "del"

const BUILD_PATH = resolve(__dirname, "../build")
const TEST_PATH  = resolve(__dirname, "../test")
const NYC_PATH   = resolve(__dirname, "../.nyc_output")

/**
 * Synchronously delete all files/patterns
 * @param {Array} paths - Paths to delete
 */
const clean = (paths) => () => sync(paths)


/**
 * Tasks
 */
gulp.task("clean-build", clean([
    join(BUILD_PATH, "**/*")
]))

gulp.task("clean-server", clean([
    join(BUILD_PATH, "*server*")
]))

gulp.task("clean-test", clean([
    join(BUILD_PATH, "*test*"),
    join(TEST_PATH, "report/**/*"),
    NYC_PATH,
]))
