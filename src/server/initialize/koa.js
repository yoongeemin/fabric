/**
 * KOA
 */

import path from "path"
import convert from "koa-convert"
import responeTime from "koa-response-time"
import compress from "koa-compress"
import bodyParser from "koa-bodyparser"
import session from "koa-generic-session"
import RedisStore from "koa-redis"
import views from "koa-views"
import logger from "koa-logger"
import { DEV } from "server/lib/constants"
import { exception } from "server/middlewares"
import "server/models"

/**
 * Initialize KOA middlewares
 * @param {Object} server
 */
const initialize = (server) => {
    server.use(responeTime())
    server.use(compress())
    server.use(bodyParser())
    server.use(exception())

    server.use(views(
        path.resolve(__dirname, "../view"),
        { map: { "hjs": "hogan" } },
    ))

    server.proxy = true
    server.keys = process.env.SESSION_SECRET
    server.use(convert(session({
        key: "sid",
        prefix: "sid:",
        allowEmpty: false,
        cookie: {
            httpOnly: true,
            signed: true,
            overwrite: true,
        },
        store: new RedisStore({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            path: process.env.REDIS_PATH,
        }),
    })))

    if (process.env.NODE_ENV === DEV) server.use(convert(logger()))
}

export default initialize
