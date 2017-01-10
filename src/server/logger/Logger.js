/**
 * Server logger using WinstonJS
 */

import path from "path"
import moment from "moment"
import winston from "winston"
import DailyRotateTransport from "winston-daily-rotate-file"

/**
 * Custom log levels
 */
const API = {
    levels: {
        error:  0,
        warn:   1,
        info:   2,
        notice: 3,
        debug:  5,
    },
    colors: {
        error:  "red",
        warn:   "yellow",
        info:   "magenta",
        notice: "cyan",
        debug:  "grey",
    },
}

export default class Logger extends winston.Logger {
    /**
     * Constructor
     * @param {Boolean} test - Test environment
     */
    constructor(test = false) {
        const options = {
            levels: API.levels,
            colors: API.colors,
            transports: [
                new (winston.transports.Console)({
                    level: "debug",
                    timestamp: () => moment().format("MM/DD/YYYY HH:mm:ss"),
                    formatter: (options) => {
                        const timestamp = options.timestamp()
                        const level = winston.config.colorize(options.level, `[${options.level.toUpperCase()}]`)
                        const message = options.message
                        return `${timestamp} ${level} ${message}`
                    },
                }),
            ],
        }

        if (!test) {
            options.transports.push(
                new DailyRotateTransport({
                    dirname: path.resolve(__dirname, "./logs"),
                    filename: "server.log",
                    datePattern: ".yyyy.MM.dd",
                    colorize: true,
                })
            )
        }

        super(options)
    }
}
