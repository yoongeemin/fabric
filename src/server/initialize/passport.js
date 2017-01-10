/**
 * Passport
 */

import passport from "koa-passport"
import local from "server/initialize/strategy/local"
import { User } from "server/models"
import { analytics } from "server/middlewares"

/**
 * Initialize passport middleware
 * @param {Object} server
 */
export const initialize = (server) => {
    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) => User.findById(id, (err, user) => done(err, user)))

    passport.use(local)

    server.use(passport.initialize())
    server.use(passport.session())

    server.use(analytics())
}

export default initialize
