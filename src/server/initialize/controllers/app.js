import { OK, UNAUTHORIZED } from "server/lib/constants"
import { HttpError } from "server/lib/errors"
// import redis from "server/databases/redis"

export const user = async (ctx) => {
    if (ctx.isAuthenticated()) {
        // const client = await redis
        // ctx.body = await client.mget(
        //     ctx.state.user.sessions,
        //     (err, sessions) => sessions
        // )
        ctx.status = OK
    }
    else throw new HttpError(UNAUTHORIZED, "Unauthorized")
}
