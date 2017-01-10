import _ from "lodash"
import { Map } from "immutable"
import { FORM_VALIDATOR_REGEX } from "app/common/constants"
import * as fieldValidators from "app/common/fieldValidators"

const formValidator = (fieldConfigs, fieldValues) => {
    let errors = Map()

    _.forEach(fieldConfigs, (field) => {
        const value = fieldValues.get(field.id)
        _.every(field.validators, (validator) => {
            const match = validator.match(FORM_VALIDATOR_REGEX)

            if (_.isUndefined(match)) throw Error("Invalid validator")
            else {
                const rule = match[1]
                const params = match[2] ? match[2].split(",") : []

                const fieldValidator = fieldValidators[rule]
                if (_.isUndefined(formValidator)) throw Error("Validator does not exist")
                else if (!fieldValidator.validate(value, ...params)) {
                    const error = fieldValidator.message(field.placeholder, ...params)
                    errors = errors.set(field.id, error)
                    return false
                }
            }
            return true
        })
    })

    return errors
}

export default formValidator
