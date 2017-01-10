/**
 * Main KOA server
 */

import KoaServer from "server/server/KoaServer"
import { emailTransporter, mongo, redis } from "server/instances"
import { koa, passport, routes } from "server/initialize"

if (!module.parent) {
    const server = new KoaServer(
        [koa, passport, routes],
        // [mongo, redis, emailTransporter]
        [mongo, redis]
    )

    server.start()

    process.on("exit", () => server.close())
    process.on("SIGINT", () => server.close())
    process.on("uncaughtException", () => server.close())
}
