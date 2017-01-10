import React from "react"
import { connect } from "react-redux"
import { ValidatedForm } from "app/native/containers"
import { changeScene, resetForm, resetPasswordRequest } from "app/redux/actions"

const PasswordReset = (props) => {
    const config = {
        id: "passwordReset",
        fields: [
            {
                id: "email",
                placeholder: "Email",
                keyboardType: "email-address",
                validators: ["required", "email"],
            },
        ],
        buttons: [
            {
                id: "reset",
                text: "Reset Password",
                submit: true,
                onPress: () => props.resetPasswordRequest(props.email),
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
PasswordReset.propTypes = {
    email:                React.PropTypes.string,
    resetForm:            React.PropTypes.func.isRequired,
    changeScene:          React.PropTypes.func.isRequired,
    resetPasswordRequest: React.PropTypes.func.isRequired,
}
/* eslint-disable react/no-unused-prop-types */

const mapStateToProps = (state) => ({
    email: state.get("auth").get("form").get("fields").get("email"),
})

export default connect(
    mapStateToProps,
    { changeScene, resetForm, resetPasswordRequest }
)(PasswordReset)
