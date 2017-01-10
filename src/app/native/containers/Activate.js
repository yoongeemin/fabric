import React from "react"
import { connect } from "react-redux"
import { TextInput, View } from "react-native"
import Styles from "app/native/styles/authentication"
import { Button } from "app/native/components"
import { activateRequest, resetTokenRequest } from "app/redux/actions"

class Activate extends React.Component {
    static propTypes = {
        uid:               React.PropTypes.string.isRequired,
        activateRequest:   React.PropTypes.func.isRequired,
        resetTokenRequest: React.PropTypes.func.isRequired,
    }

    render() {
        return (
            <View style={Styles.flexCol}>
                <TextInput style={Styles.textInput}
                           keyboardType="numeric"
                           onChangeText={(value) => {
                               this.setState({ token: value })
                           }} />
                <Button style={[Styles.bgRed]}
                        text="Activate"
                        onPress={() => {
                            this.props.activateRequest(
                                this.props.uid,
                                this.state.token
                            )
                        }} />
                <Button style={[Styles.bgRed]}
                        text="Resend Code"
                        onPress={() => {
                            this.props.resetTokenRequest(
                                this.props.uid
                            )
                        }} />
            </View>
        )
    }
}

export default connect(
    null,
    { activateRequest, resetTokenRequest }
)(Activate)
