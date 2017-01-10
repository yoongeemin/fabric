/**
 * Generic exception handler
 */

import logger from "server/instances/logger"
import { INTERNAL_SERVER_ERROR, SERVICE_UNAVAILABLE } from "server/lib/constants"

const LOGGER = "SERVER"

const exception = () => async (ctx, next) => {
    try { await next() }
    catch (err) {
        let status
        let message
        switch (err.errno) {
            case "SERVERERROR":
                status = err.status
                message = err.message
                break
            case "ENOTFOUND":
                status = SERVICE_UNAVAILABLE
                message = "Server is offline"
                break
            default:
                status = INTERNAL_SERVER_ERROR
                message = "Internal server error"
                break
        }

        logger.error(`[${LOGGER}] ${status} ${message}\n${err.stack || null}`)
        ctx.status = status
        ctx.body = {
            name: "ServerError",
            message,
        }
    }
}

export default exception
