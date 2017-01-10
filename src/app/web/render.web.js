import React from "react"
import { renderToString } from "react-dom/server"
import { Provider } from "react-redux"
import { RouterContext, createMemoryHistory, match } from "react-router"
import { promisify } from "bluebird"
import configureStore from "app/redux/stores/store"
import reducers from "app/redux/reducers"
import sagas from "app/redux/sagas"
import configureRoutes from "app/web/lib/configureRoutes"
import { OK, DEV } from "server/lib/constants"
import stateFactory from "app/redux/reducers/stateFactory"
import { auth } from "app/redux/reducers/schemas"
import { Map } from "immutable"

const matchPromise = promisify(match, { multiArgs: true })

/**
 * Server side rendering controller
 * @param ctx Koa context
 */
const render = async (ctx) => {
    try {
        const authState = { authenticated: ctx.isAuthenticated() }
        const initialState = Map({ auth: stateFactory(auth).createState(authState) })

        const memoryHistory = createMemoryHistory(ctx.url)
        const store = configureStore(reducers, initialState, memoryHistory)
        const routes = configureRoutes(store)

        const matched = await matchPromise({ routes, location: ctx.url })
        if (matched) {
            const [ redirect, renderProps ] = matched
            if (redirect) ctx.redirect(`${redirect.pathname}${redirect.search}`)
            else if (renderProps) {
                const component = (
                    <Provider store={store}>
                        <RouterContext {...renderProps} />
                    </Provider>
                )

                const render = store.runSaga(sagas).done
                    .then(async () => {
                        const path = (process.env.NODE_ENV === DEV)
                            ? `${process.env.WDS_PROTOCOL}://${process.env.WDS_HOST}:${process.env.WDS_PORT}`
                            : ""

                        /**
                         * Second render: markup
                         */
                        const context = {
                            csrf:         ctx.csrf,
                            main:         renderToString(component),
                            app:          `${path}/build/app.js`,
                            vendor:       `${path}/build/vendor.js`,
                            manifest:     `${path}/build/manifest.js`,
                            initialState: JSON.stringify(store.getState()),
                        }
                        await ctx.render("web.hjs", context)
                        ctx.status = OK
                    })

                /**
                 * First render: invoke sagas in componentWillMount
                 */
                renderToString(component)
                store.close()

                await render
            }
        }
    }
    catch (err) { throw new Error(err) }
}

export default render
