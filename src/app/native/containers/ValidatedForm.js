import _ from "lodash"
import React  from "react"
import { Map } from "immutable"
import { TextInput, View, Text } from "react-native"
import { connect } from "react-redux"
import { Button } from "app/native/components"
import Common from "app/native/styles/common"
import Styles from "app/native/styles/authentication"
import { fieldChange, setValidationErrors } from "app/redux/actions"
import formValidator from "app/common/formValidator"

const ValidatedForm = (props) => {
    const fields = _.map(props.config.fields, (field) => {
        const style = props.validationErrors.get(field.id)
            ? Styles.textInputError
            : Styles.textInput

        return (
            <TextInput key={field.id}
                       style={style}
                       placeholder={field.placeholder}
                       secureTextEntry={field.password || false}
                       autoCapitalize={field.capitalize ? "sentences" : "none"}
                       keyboardType={field.keyboardType || "default"}
                       onChangeText={(value) => props.fieldChange(field.id, value)} />
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

        const style = props.loading ? Styles.bgBlack : Styles.bgRed

        return (
            <Button key={button.id}
                    style={[style]}
                    text={button.text}
                    onPress={onPress} />
        )
    })

    return (
        <View style={[Common.flex, Common.flexCol]}>
            {fields}
            {buttons}
        </View>
    )
}

/* eslint-disable react/no-unused-prop-types */
ValidatedForm.propTypes = {
    config:              React.PropTypes.object.isRequired,
    setValidationErrors: React.PropTypes.func.isRequired,
    fieldChange:         React.PropTypes.func.isRequired,
    loading:             React.PropTypes.bool.isRequired,
    fields:              React.PropTypes.instanceOf(Map).isRequired,
    validationErrors:    React.PropTypes.instanceOf(Map).isRequired,
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
