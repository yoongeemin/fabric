/**
 * Field validators used for validated forms
 */

import _ from "lodash"
import { EMAIL_REGEX } from "app/common/constants"

/**
 * Check if the value is a valid email address based on Regex
 */
export const email = {
    validate: (value) => EMAIL_REGEX.test(value),
    message: (field) => `${field} is invalid`,
}

/**
 * Check if the value matches args[0]
 */
export const match = {
    validate: (value, fieldName, password) => _.isEqual(value, password),
    message: (field, fieldName) => `${fieldName} should match`,
}

/**
 * Check if the value is at least args[0] characters long
 */
export const minLength = {
    validate: (value, minLength) => (value.length >= minLength),
    message: (field, minLength) => `${field} must be at least ${minLength} characters`,
}

/**
 * Check if the value is not null
 */
export const required = {
    validate: (value) => !_.isEmpty(value),
    message: (field) => `${field} is required`,
}
