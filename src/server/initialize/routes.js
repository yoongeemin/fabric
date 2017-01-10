/**
 * Routes
 */

import Router from "koa-router"
import { auth, app } from "server/initialize/controllers"
import { csrf } from "server/middlewares"
import render from "app/web/render.web"

const API_PREFIX = "/api"

/**
 * Initialize KOA middlewares
 * @param {Object} server
 */
const initialize = (server) => {
    const router = new Router()
    const CSRF = csrf({})
    server.use(CSRF.shim())

    /**
     * Public API
     */
    router.post(`${API_PREFIX}/signin`,         auth.signIn)
    router.post(`${API_PREFIX}/register`,       auth.register)
    router.get(`${API_PREFIX}/signout`,         auth.signOut)
    router.post(`${API_PREFIX}/verify/email`,   auth.verifyEmail)
    router.post(`${API_PREFIX}/reset/password`, auth.resetPassword)

    // Server side rendering
    router.get("*", render)

    // Verify CSRF Token for restricted APIs
    // router.use(CSRF.verify({}))

    /**
     * Restricted API
     */
    router.post(`${API_PREFIX}/user`, app.user)

    server.use(router.routes())
    server.use(router.allowedMethods())
}

export default initialize
