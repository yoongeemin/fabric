/**
 * Environments
 */
export const DEV  = "DEV"
export const QA   = "QA"
export const PROD = "PROD"

/**
 * Authentication actions
 */
export const SIGN_IN_REQUEST               = "SIGN_IN_REQUEST"
export const SIGN_IN_SUCCESS               = "SIGN_IN_SUCCESS"
export const SIGN_IN_FAILURE               = "SIGN_IN_FAILURE"
export const SIGN_OUT_REQUEST              = "SIGN_OUT_REQUEST"
export const SIGN_OUT_SUCCESS              = "SIGN_OUT_SUCCESS"
export const SIGN_OUT_FAILURE              = "SIGN_OUT_FAILURE"
export const REGISTER_REQUEST              = "REGISTER_REQUEST"
export const REGISTER_SUCCESS              = "REGISTER_SUCCESS"
export const REGISTER_FAILURE              = "REGISTER_FAILURE"
export const ACTIVATE_REQUEST              = "ACTIVATE_REQUEST"
export const ACTIVATE_SUCCESS              = "ACTIVATE_SUCCESS"
export const ACTIVATE_FAILURE              = "ACTIVATE_FAILURE"
export const RESET_TOKEN_REQUEST           = "RESET_TOKEN_REQUEST"
export const RESET_TOKEN_SUCCESS           = "RESET_TOKEN_SUCCESS"
export const RESET_TOKEN_FAILURE           = "RESET_TOKEN_FAILURE"
export const RESET_PASSWORD_REQUEST        = "RESET_PASSWORD_REQUEST"
export const RESET_PASSWORD_SUCCESS        = "RESET_PASSWORD_SUCCESS"
export const RESET_PASSWORD_FAILURE        = "RESET_PASSWORD_FAILURE"
export const RESET_PASSWORD_SUBMIT_REQUEST = "RESET_PASSWORD_SUBMIT_REQUEST"
export const RESET_PASSWORD_SUBMIT_SUCCESS = "RESET_PASSWORD_SUBMIT_SUCCESS"
export const RESET_PASSWORD_SUBMIT_FAILURE = "RESET_PASSWORD_SUBMIT_FAILURE"

/**
 * Form actions
 */
export const FIELD_CHANGE          = "FIELD_CHANGE"
export const RESET_FORM            = "RESET_FORM"
export const SET_VALIDATION_ERRORS = "SET_VALIDATION_ERRORS"

/**
 * App actions
 */
export const SET_ALERT    = "SET_ALERT"
export const CHANGE_SCENE = "CHANGE_SCENE"

/**
 * API
 */
export const HOST               = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`
export const SIGN_IN_API        = `${HOST}/api/signin/`
export const SIGN_OUT_API       = `${HOST}/api/signout/`
export const REGISTER_API       = `${HOST}/api/register/`
export const ACTIVATE_API       = `${HOST}/api/activate/`
export const VERIFY_EMAIL_API   = `${HOST}/api/verify/email`
export const RESET_TOKEN_API    = `${HOST}/api/reset/token`
export const RESET_PASSWORD_API = `${HOST}/api/reset/password`

/**
 * REGEX
 */
export const EMAIL_REGEX = /^[-a-z0-9~!$%^&*_=+}{'?]+(\.[-a-z0-9~!$%^&*_=+}{'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i
export const FORM_VALIDATOR_REGEX = /^([a-zA-Z]+)(?:\((.+)\))?$/

/**
 * Types
 */
export const NUMBER  = "NUMBER"
export const STRING  = "STRING"
export const BOOLEAN = "BOOLEAN"
export const OBJECT  = "OBJECT"
export const MAP     = "MAP"
export const LIST    = "LIST"

/**
 * Miscellaneous
 */
export const JWT = "JWT"
