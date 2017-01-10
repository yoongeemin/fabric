import {
    FIELD_CHANGE,
    RESET_FORM,
    SET_VALIDATION_ERRORS,
    SIGN_IN_REQUEST,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE,
    SIGN_OUT_REQUEST,
    SIGN_OUT_SUCCESS,
    SIGN_OUT_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    ACTIVATE_REQUEST,
    ACTIVATE_SUCCESS,
    ACTIVATE_FAILURE,
    RESET_TOKEN_REQUEST,
    RESET_TOKEN_SUCCESS,
    RESET_TOKEN_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_SUBMIT_REQUEST,
    RESET_PASSWORD_SUBMIT_SUCCESS,
    RESET_PASSWORD_SUBMIT_FAILURE,
} from "app/common/constants"

/**
 * Form actions
 */
export const fieldChange = (field, value) =>
    ({
        type: FIELD_CHANGE,
        payload: { field, value },
    })

export const setValidationErrors = (errors) =>
    ({
        type: SET_VALIDATION_ERRORS,
        payload: { errors },
    })

export const resetForm = () =>
    ({ type: RESET_FORM })

/**
 * Authentication actions
 */
export const signInRequest = (credentials) =>
    ({
        type: SIGN_IN_REQUEST,
        payload: { credentials },
    })

export const signInSuccess = (user) =>
    ({
        type: SIGN_IN_SUCCESS,
        payload: { user },
    })

export const signInFailure = (message) =>
    ({
        type: SIGN_IN_FAILURE,
        error: { message },
    })

export const signOutRequest = () =>
    ({ type: SIGN_OUT_REQUEST })

export const signOutSuccess = () =>
    ({ type: SIGN_OUT_SUCCESS })

export const signOutFailure = (message) =>
    ({
        type: SIGN_OUT_FAILURE,
        error: { message },
    })

export const registerRequest = (credentials) =>
    ({
        type: REGISTER_REQUEST,
        payload: { credentials },
    })

export const registerSuccess = () =>
    ({ type: REGISTER_SUCCESS })

export const registerFailure = (message) =>
    ({
        type: REGISTER_FAILURE,
        error: { message },
    })

export const activateRequest = (uid, token) =>
    ({
        type: ACTIVATE_REQUEST,
        payload: { uid, token },
    })

export const activateSuccess = (user) =>
    ({
        type: ACTIVATE_SUCCESS,
        payload: { user },
    })

export const activateFailure = (message) =>
    ({
        type: ACTIVATE_FAILURE,
        error: { message },
    })

export const resetTokenRequest = (uid) =>
    ({
        type: RESET_TOKEN_REQUEST,
        payload: { uid },
    })

export const resetTokenSuccess = () =>
    ({ type: RESET_TOKEN_SUCCESS })

export const resetTokenFailure = (message) =>
    ({
        type: RESET_TOKEN_FAILURE,
        error: { message },
    })

export const resetPasswordRequest = (email) =>
    ({
        type: RESET_PASSWORD_REQUEST,
        payload: { email },
    })

export const resetPasswordSuccess = () =>
    ({ type: RESET_PASSWORD_SUCCESS })

export const resetPasswordFailure = (message) =>
    ({
        type: RESET_PASSWORD_FAILURE,
        error: { message },
    })

export const resetPasswordSubmitRequest = (password, uid, token) =>
    ({
        type: RESET_PASSWORD_SUBMIT_REQUEST,
        payload: { password, uid, token },
    })

export const resetPasswordSubmitSuccess = () =>
    ({ type: RESET_PASSWORD_SUBMIT_SUCCESS })

export const resetPasswordSubmitFailure = (message) =>
    ({
        type: RESET_PASSWORD_SUBMIT_FAILURE,
        error: { message },
    })
