import React from "react"
import { connect } from "react-redux"
import { ValidatedForm } from "app/web/containers"
import { signInRequest, resetForm, changeScene } from "app/redux/actions"

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
        <div>
            <ValidatedForm config={config} />
            <a href="JavaScript:void(0)"
               onClick={() => props.changeScene("passwordReset")}>
                Forgot Password
            </a>
        </div>
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
    { signInRequest, resetForm, changeScene }
)(SignIn)
