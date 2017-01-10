// /**
//  * Test runner
//  */
//
// import gulp from "gulp"
// import { join, resolve } from "path"
// import { log, PluginError } from "gulp-util"
// import mocha from "gulp-mocha"
// import exec from "gulp-exec"
// import open from "gulp-open"
// import { Server } from "karma"
// import { argv } from "yargs"
//
// const BUILD_PATH  = resolve(__dirname, "../build")
// const TEST_PATH   = resolve(__dirname, "../test")
//
// /**
//  * Run Mocha test
//  * @param {Array} paths - paths to tests
//  */
// const test = (path) =>
//     () => gulp.src([path], { read: false })
//         .pipe(mocha({
//             reporter: "spec",
//         }))
//         .on("error", log)
//
// /**
//  * Run nyc coverage report on test suite
//  * @param {String} path - Path to test suite
//  */
// const coverage = (path) =>
//     (done) => gulp.src("./")
//         .pipe(exec(
//             `nyc mocha ${path}`,
//             {
//                 continueOnError: false,
//                 pipeStdout: false,
//             },
//             (err) => {
//                 if (err) throw new PluginError(err.name, err.message)
//                 done()
//             },
//         ))
//
// /**
//  * Open URI in browser
//  * @param {String} uri - URI to open
//  */
// const browser = (uri) =>
//     () =>
//         gulp.src("./")
//             .pipe(open({
//                 uri,
//                 app: "Google Chrome",
//             }))
//             .on("error", log)
//
// /**
//  * Run Karma test runner
//  * @param {String} config - Path to Karma config
//  */
// const karma = (config) =>
//     (done) =>
//         new Server({
//             configFile: config,
//             singleRun: true,
//         }, done).start()
//
//
// /**
//  * Tasks
//  */
// const __COVERAGE__ = argv.coverage
//
// // Server
// gulp.task("test-server", ["compile-server-test"], test(
//     join(BUILD_PATH, "test.js"),
// ))
//
// gulp.task("cover-server", ["clean-test", "compile-server-test"], coverage(
//     join(BUILD_PATH, "test.js"),
// ))
//
// gulp.task("report-server", ["cover-server"], browser(
//     join(TEST_PATH, "report/server/lcov-report/index.html")
// ))
//
// // App
// gulp.task("test-app", karma(
//     join(TEST_PATH, "app/karma.conf.js"),
// ))
//
// gulp.task("report-app", ["test-app"], browser(
//     join(TEST_PATH, "report/app/lcov-report/index.html")
// ))


/**
 * Test runner
 */

import gulp from "gulp"
import { join, resolve } from "path"
import { log, PluginError } from "gulp-util"
import mocha from "gulp-mocha"
import exec from "gulp-exec"
import open from "gulp-open"
import { Server } from "karma"
import { argv } from "yargs"

const BUILD_PATH  = resolve(__dirname, "../build")
const TEST_PATH   = resolve(__dirname, "../test")


/**
 * Open URI in browser
 * @param {String} uri - URI to open
 */
const browser = (uri) =>
    open({
        uri,
        app: "Google Chrome",
    })

/**
 * Run server test
 * @param {String} path - Path to test suite
 */
const server = (path) =>
    () => (
        (argv.coverage)
            /**
             * With coverage
             */
            ? (
                gulp.src("./")
                    .pipe(exec(
                        `nyc mocha ${path}`,
                        {
                            continueOnError: false,
                            pipeStdout: false,
                        },
                        (err) => {
                            if (err) throw new PluginError(err.name, err.message)
                        },
                    ))
                    .pipe(browser(join(TEST_PATH, "report/server/lcov-report/index.html")))
                    .on("error", log)
            )
            /**
             * Without coverage
             */
            : (
                gulp.src(path, { read: false })
                    .pipe(mocha({
                        reporter: "spec",
                    }))
                    .on("error", log)
            )
    )

/**
 * Run app test
 * @param {String} config - Path to Karma config
 */
const app = (config) =>
    (done) => (
        new Server(
            {
                configFile: config,
                singleRun: true,
            },
            () => {
                /**
                 * With coverage
                 */
                if (argv.coverage) {
                    gulp.src("./")
                        .pipe(browser(join(TEST_PATH, "report/app/lcov-report/index.html")))
                        .on("error", log)
                        .on("done", done)
                }
            }
        ).start()
    )


/**
 * Tasks
 */
// Server
gulp.task("test-server", ["clean-test", "compile-server-test"], server(
    join(BUILD_PATH, "test.js"),
))

// App
gulp.task("test-app", app(
    join(TEST_PATH, "app/karma.conf.js"),
))
