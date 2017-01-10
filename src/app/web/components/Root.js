import React from "react"
import { Provider } from "react-redux"
import { Router } from "react-router"

const Root = (props) => (
    <Provider store={props.store}>
        <Router {...props.renderProps} />
    </Provider>
)

Root.propTypes = {
    store:       React.PropTypes.object.isRequired,
    renderProps: React.PropTypes.object.isRequired,
}

export default Root
