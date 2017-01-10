import _ from "lodash"
import React  from "react"
import { Alert } from "react-native"
import { connect } from "react-redux"
import { setAlert } from "app/redux/actions"

class Reducer extends React.Component {
    static propTypes = {
        jwt:       React.PropTypes.string,
        alert:     React.PropTypes.object,
        scene:     React.PropTypes.object,
        navigator: React.PropTypes.object,
        setAlert:  React.PropTypes.func,
    }

    shouldComponentUpdate(nextProps) {
        // Check scene
        this.handleUpdate(
            ["scene", "id"],
            nextProps,
            () => {
                this.props.navigator.replace({
                    id: nextProps.scene.get("id"),
                    passProps: nextProps.scene.get("passProps"),
                })
            },
            _.noop
        )

        // Check alert
        this.handleUpdate(
            ["alert", "message"],
            nextProps,
            () => {
                Alert.alert("", nextProps.alert.get("message"))
                this.props.setAlert(null)
            },
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
    alert: state.get("app").get("alert"),
    scene: state.get("app").get("scene"),
})

export default connect(
    mapStateToProps,
    { setAlert },
)(Reducer)
