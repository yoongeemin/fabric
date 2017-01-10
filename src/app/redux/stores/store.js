import { createStore, applyMiddleware } from "redux"
import createSagaMiddleware, { END } from "redux-saga"
import { routerMiddleware } from "react-router-redux"
import createLogger from "redux-logger"
import { DEV } from "app/common/constants"

const isDevelopment = (process.env.NODE_ENV === DEV)

const configureStore = (reducers, initialState, history = null) => {
    const sagaMiddleware = createSagaMiddleware()
    const middlewares = [
        sagaMiddleware,
    ]

    if (history) middlewares.push(routerMiddleware(history))

    if (isDevelopment) middlewares.push(createLogger())

    const store = createStore(reducers, initialState, applyMiddleware(...middlewares))

    // Hot module replacement
    if (isDevelopment && module.hot) {
        module.hot.accept("../reducers", () => {
            const nextReducer = require("../reducers").default
            store.replaceReducer(nextReducer)
        })
    }

    store.runSaga = sagaMiddleware.run
    store.close = () => store.dispatch(END)
    return store
}

export { configureStore as default }
