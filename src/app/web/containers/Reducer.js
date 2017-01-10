import _ from "lodash"
import React from "react"
import { browserHistory } from "react-router"
import { connect } from "react-redux"

class Reducer extends React.Component {
    shouldComponentUpdate(nextProps) {
        // Check scene
        this.handleUpdate(
            ["scene", "path"],
            nextProps,
            () => browserHistory.push(nextProps.scene.get("path")),
            _.noop
        )

        return false
    }

    handleUpdate(path, nextProps, handleTrue, handleFalse) {
        const key = path[0]
        const prop = (path.length === 1) ? this.props[key] : this.props[key].getIn(_.slice(path, 1))
        const nextProp = (path.length === 1) ? nextProps[key] : nextProps[key].getIn(_.slice(path, 1))
        if (!_.isEqual(prop, nextProp)) {
            if (!_.isNull(nextProp)) handleTrue()
            else handleFalse()
        }
    }

    render() { return null }
}

const mapStateToProps = (state) => ({
    scene: state.get("app").get("scene"),
})

export default connect(
    mapStateToProps,
    null
)(Reducer)
