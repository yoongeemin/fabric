import React from "react"
import { connect } from "react-redux"
import { ValidatedForm } from "app/web/containers"
import { resetPasswordSubmitRequest } from "app/redux/actions"

const PasswordResetSubmit = (props) => {
    const config = {
        id: "passwordResetSubmit",
        fields: [
            {
                id: "password",
                placeholder: "New Password",
                password: true,
                validators: ["required"],
            },
        ],
        buttons: [
            {
                id: "reset",
                text: "Reset",
                submit: true,
                onPress: () => props.resetPasswordSubmitRequest(
                    props.password,
                    props.params.uid,
                    props.params.token
                ),
            },
        ],
    }

    return <ValidatedForm config={config} />
}

/* eslint-disable react/no-unused-prop-types */
PasswordResetSubmit.propTypes = {
    password:                   React.PropTypes.string,
    params:                     React.PropTypes.object.isRequired,
    resetPasswordSubmitRequest: React.PropTypes.func.isRequired,
}
/* eslint-disable react/no-unused-prop-types */

const mapStateToProps = (state) => ({
    password: state.get("auth").get("form").get("fields").get("password"),
})

export default connect(
    mapStateToProps,
    { resetPasswordSubmitRequest }
)(PasswordResetSubmit)
