import React from "react"
import { Provider } from "react-redux"
import { Map } from "immutable"
import reducers from "app/redux/reducers"
import sagas from "app/redux/sagas"
import configureStore from "app/redux/stores/store"
import Root from "app/native/components/Root"

const store = configureStore(reducers, Map())
store.runSaga(sagas)

const App = () => (
    <Provider store={store}>
        <Root />
    </Provider>
)

export default App
