/**
 * Lint
 */

import gulp from "gulp"
import { join, resolve } from "path"
import eslint from "gulp-eslint"

const APP_PATH     = resolve(__dirname, "../src/app")
const SERVER_PATH  = resolve(__dirname, "../src/server")
const CONFIG_PATH  = resolve(__dirname, "../src/config")

/**
 * Run linter
 * @param {Array} paths - Paths to include
 * @param {String} config - Path to lint config
 */
const lint = (paths, config) =>
    () => gulp.src(paths)
        .pipe(eslint({ configFile: config }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())


/**
 * Tasks
 */
gulp.task("lint-server", lint(
    [join(SERVER_PATH, "**/*.js")],
    join(CONFIG_PATH, "lint/.eslintrc.server")
))

gulp.task("lint-app", lint(
    [join(APP_PATH, "**/*.js")],
    join(CONFIG_PATH, "lint/.eslintrc.app")
))

