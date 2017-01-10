import _ from "lodash"
import React  from "react"
import { Map } from "immutable"
import { connect } from "react-redux"
import { fieldChange, setValidationErrors } from "app/redux/actions"
import formValidator from "app/common/formValidator"

const ValidatedForm = (props) => {
    const fields = _.map(props.config.fields, (field) => {
        // const style = props.validationErrors.get(field.id)
        //     ? Styles.textInputError
        //     : Styles.textInput
        return (
            <input key={field.id}
                   type={field.password ? "password" : "text"}
                   placeholder={field.placeholder}
                   onChange={(event) => props.fieldChange(field.id, event.target.value)} />
        )
    })

    const buttons = _.map(props.config.buttons, (button) => {
        const onPress = button.submit
            ? () => {
                const errors = formValidator(props.config.fields, props.fields)
                if (!errors.isEmpty()) props.setValidationErrors(errors)
                else button.onPress()
            }
            : button.onPress

        // const style = props.loading ? Styles.bgBlack : Styles.bgRed
        return (
            <button key={button.id}
                    type="button"
                    onClick={onPress}>
                {button.text}
            </button>
        )
    })

    return (
        <form>
            {fields}
            {buttons}
        </form>
    )
}

/* eslint-disable react/no-unused-prop-types */
ValidatedForm.propTypes = {
    config:              React.PropTypes.object.isRequired,
    fields:              React.PropTypes.instanceOf(Map).isRequired,
    validationErrors:    React.PropTypes.instanceOf(Map).isRequired,
    setValidationErrors: React.PropTypes.func.isRequired,
    fieldChange:         React.PropTypes.func.isRequired,
    loading:             React.PropTypes.bool.isRequired,
}
/* eslint-disable react/no-unused-prop-types */

const mapStateToProps = (state) => ({
    fields:           state.get("auth").get("form").get("fields"),
    loading:          state.get("auth").get("form").get("loading"),
    validationErrors: state.get("auth").get("form").get("validationErrors"),
})

export default connect(
    mapStateToProps,
    { fieldChange, setValidationErrors }
)(ValidatedForm)
