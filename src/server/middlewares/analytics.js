import _ from "lodash"
import Bluebird from "bluebird"
import { IOS, WEB } from "server/lib/constants"

const AGENT_PLATFORM_MAP = {
    "CFNetwork": IOS,
    "Mozilla":   WEB,
    "Chrome":    WEB,
    "Safari":    WEB,
}

const getPlatform = (agent) =>
    new Bluebird((resolve) => {
        let platform = "UNKNOWN"
        _.some(AGENT_PLATFORM_MAP, (value, key) => {
            if (_.includes(agent, key)) {
                platform = value
                return true
            }
        })
        return resolve(platform)
    })

const analytics = () =>
    async (ctx, next) => {
        if (ctx.session) ctx.session.platform = await getPlatform(ctx.headers["user-agent"])
        await next()
    }

export default analytics
