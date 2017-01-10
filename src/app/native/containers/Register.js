import React from "react"
import { connect } from "react-redux"
import { ValidatedForm } from "app/native/containers"
import { changeScene, resetForm, registerRequest } from "app/redux/actions"

const Register = (props) => {
    const config = {
        id: "register",
        fields: [
            {
                id: "email",
                placeholder: "Email",
                keyboardType: "email-address",
                validators: ["required", "email"],
            },
            {
                id: "password",
                placeholder: "Password",
                password: true,
                validators: ["required", "minLength(7)"],
            },
            {
                id: "password_again",
                placeholder: "Confirm Password",
                password: true,
                validators: [`match(Password,${props.password})`],
            },
        ],
        buttons: [
            {
                id: "register",
                text: "Register",
                submit: true,
                onPress: () => {
                    props.registerRequest({
                        email:    props.email,
                        password: props.password,
                    })
                },
            },
            {
                id: "cancel",
                text: "Cancel",
                onPress: () => {
                    props.changeScene("signIn")
                    props.resetForm()
                },
            },
        ],
    }
    return <ValidatedForm config={config} />
}

/* eslint-disable react/no-unused-prop-types */
Register.propTypes = {
    email:           React.PropTypes.string,
    password:        React.PropTypes.string,
    resetForm:       React.PropTypes.func.isRequired,
    registerRequest: React.PropTypes.func.isRequired,
    changeScene:     React.PropTypes.func.isRequired,
}
/* eslint-disable react/no-unused-prop-types */

const mapStateToProps = (state) => ({
    email:    state.get("auth").get("form").get("fields").get("email"),
    password: state.get("auth").get("form").get("fields").get("password"),
})

export default connect(
    mapStateToProps,
    { changeScene, resetForm, registerRequest }
)(Register)
