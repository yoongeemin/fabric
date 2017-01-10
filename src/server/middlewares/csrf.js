/**
 * CSRF validation middleware
 */

import _ from "lodash"
import CSRF from "csrf"
import { parse } from "url"
import { HOST, UNAUTHORIZED, WEB } from "server/lib/constants"
import { HttpError } from "server/lib/errors"

/**
 * CSRF middleware
 * @param {Number} saltLength
 * @param {Number} secretLength
 * @returns {Function} Middleware
 */
const csrf = ({
    saltLength = 8,
    secretLength = 18,
}) => {
    const Token = CSRF({ saltLength, secretLength })
    return {
        /**
         * Shim csrf property for KOA context
         */
        shim: () =>
            async (ctx, next) => {
                Object.defineProperty(ctx, "csrf", {
                    get: () => {
                        if (ctx._csrf) return ctx._csrf
                        if (!ctx.session) return null
                        if (!ctx.session.secret) ctx.session.secret = Token.secretSync()
                        ctx._csrf = Token.create(ctx.session.secret)
                        return ctx._csrf
                    },
                })
                return next()
            },

        /**
         * Validate CSRF token
         * @param {Array} excludedMethods - HTTP methods to ignore CSRF validation
         * @param {Array} includedPlatforms - PLATFORMS to include CSRF validation
         */
        validate: ({
            excludedMethods = ["GET", "HEAD", "OPTIONS"] },
            includedPlatforms = [WEB],
        ) =>
            async (ctx, next) => {
                /**
                 * Skip excluded HTTP methods
                 */
                if (_.includes(excludedMethods, ctx.method)) return next()

                /**
                 * Skip excluded platforms
                 */
                if (!_.includes(includedPlatforms, ctx.session.platform)) return next()

                if (!ctx.session.secret) ctx.session.secret = Token.secretSync()

                /**
                 * Verify source origin header
                 */
                let source = ctx.headers.origin
                if (!source) {
                    const referer = parse(ctx.headers.referer)
                    source = `${referer.protocol}:\/\/${referer.host}`
                }
                if (!_.isEqual(HOST, source)) throw new HttpError("Unknown source origin", UNAUTHORIZED)

                /**
                 * Verify CSRF Token
                 */
                const csrf = ctx.headers["x-csrf-token"]
                if (!csrf) throw new HttpError("CSRF token is missing", UNAUTHORIZED)
                if (!Token.verify(ctx.session.secret, csrf)) throw new HttpError("CSRF token is missing", UNAUTHORIZED)

                return next()
            },
    }
}

export default csrf
