import _ from "lodash"
import React from "react"
import { Text, View } from "react-native"
import { connect } from "react-redux"
import Styles from "app/native/styles/authentication"
import { HOST } from "app/common/constants"
import { signInSuccess, changeScene, getUser } from "app/redux/actions"
// import CookieManager from "react-native-cookies"

class Launch extends React.Component {
    static propTypes = {
        changeScene:   React.PropTypes.func.isRequired,
        signInSuccess: React.PropTypes.func.isRequired,
    }

    componentWillMount() {
        // Storage.get(JWT).then((jwt) => {
        //     if (jwt) {
        //         this.props.signInSuccess()
        //         this.props.changeScene("app")
        //     }
        //     else this.props.changeScene("signIn")
        // })

    //     const self = this
    //     CookieManager.get(HOST, (err, res) => {
    //         if (_.has(res, "koa.sid")) {
    //             //self.props.getUser()
    //             this.props.changeScene("signIn")
    //         }
    //     })
    }

    render() {
        return (
            <View style={Styles.flexCol}>
                <Text style={Styles.flex}>
                    Launching...
                </Text>
            </View>
        )
    }
}

export default connect(
    null,
    { signInSuccess, changeScene, getUser }
)(Launch)
