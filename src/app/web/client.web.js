import _ from "lodash"
import { promisify } from "bluebird"
import { Map } from "immutable"
import React from "react"
import { render } from "react-dom"
import { match, browserHistory } from "react-router"
import { syncHistoryWithStore } from "react-router-redux"
import { AppContainer } from "react-hot-loader"
import configureStore from "app/redux/stores/store"
import configureRoutes from "app/web/lib/configureRoutes"
import * as Schemas from "app/redux/reducers/schemas"
import stateFactory from "app/redux/reducers/stateFactory"
import reducers from "app/redux/reducers"
import sagas from "app/redux/sagas"
import { Root } from "app/web/components"

const matchPromise = promisify(match, { multiArgs: true })

/* eslint-disable no-undef */
const dest = document.getElementById("main")

const initialState = _.reduce(window.__INITIAL_STATE__, (result, value, key) => {
    const state = stateFactory(Schemas[key]).createState(value)
    return result.set(key, state)
}, Map())
/* eslint-disable no-undef */

const store = configureStore(reducers, initialState, browserHistory)
const routes = configureRoutes(store)
const history = syncHistoryWithStore(browserHistory, store, {
    selectLocationState: (state) => state.get("route").toJS(),
})

store.runSaga(sagas)

const renderAsync = async (Render) => {
    const matched = await matchPromise({ history, routes })
    const renderProps = matched[1]
    render((
        <AppContainer>
            <Render store={store} renderProps={renderProps} />
        </AppContainer>
    ), dest)
}

renderAsync(Root)

// Hot module replacement
if (module.hot) {
    module.hot.accept("./components/Root", () => {
        // Restart sagas
        store.close()
        store.runSaga(sagas)

        const Hot = require("./components/Root").default
        renderAsync(Hot)
    })
}
