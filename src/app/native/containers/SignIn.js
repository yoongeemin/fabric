import React from "react"
import { View, Text } from "react-native"
import { connect } from "react-redux"
import { ValidatedForm } from "app/native/containers"
import { changeScene, resetForm, signInRequest } from "app/redux/actions"

const SignIn = (props) => {
    const config = {
        id: "signin",
        fields: [
            {
                id: "emailorphone",
                placeholder: "Email or Phone Number",
                validators: ["required"],
            },
            {
                id: "password",
                placeholder: "Password",
                password: true,
                validators: ["required"],
            },
        ],
        buttons: [
            {
                id: "signin",
                text: "Sign In",
                submit: true,
                onPress: () => {
                    props.signInRequest({
                        emailorphone: props.emailorphone,
                        password:     props.password,
                    })
                },
            },
            {
                id: "register",
                text: "Register",
                onPress: () => {
                    props.changeScene("register")
                    props.resetForm()
                },
            },
        ],
    }

    return (
        <View>
            <ValidatedForm config={config} />
            <Text onPress={() => props.changeScene("passwordReset")}>
                Forgot Password
            </Text>
        </View>
    )
}

/* eslint-disable react/no-unused-prop-types */
SignIn.propTypes = {
    emailorphone:  React.PropTypes.string,
    password:      React.PropTypes.string,
    signInRequest: React.PropTypes.func.isRequired,
    resetForm:     React.PropTypes.func.isRequired,
    changeScene:   React.PropTypes.func.isRequired,
}
/* eslint-disable react/no-unused-prop-types */

const mapStateToProps = (state) => ({
    emailorphone: state.get("auth").get("form").get("fields").get("emailorphone"),
    password:     state.get("auth").get("form").get("fields").get("password"),
})

export default connect(
    mapStateToProps,
    { changeScene, resetForm, signInRequest }
)(SignIn)
