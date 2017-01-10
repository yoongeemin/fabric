import { takeLatest } from "redux-saga"
import { call, put } from "redux-saga/effects"
import { GET, POST } from "app/common/http"
import {
    HOST,
    SIGN_IN_API,
    SIGN_OUT_API,
    REGISTER_API,
    ACTIVATE_API,
    RESET_TOKEN_API,
    RESET_PASSWORD_API,
    SIGN_IN_REQUEST,
    SIGN_OUT_REQUEST,
    REGISTER_REQUEST,
    ACTIVATE_REQUEST,
    RESET_TOKEN_REQUEST,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUBMIT_REQUEST,
} from "app/common/constants"
import {
    changeScene,
    setAlert,
    setValidationErrors,
    signInSuccess,
    signInFailure,
    signOutSuccess,
    signOutFailure,
    registerSuccess,
    registerFailure,
    activateSuccess,
    activateFailure,
    resetTokenSuccess,
    resetTokenFailure,
    resetPasswordSuccess,
    resetPasswordFailure,
    resetPasswordSubmitSuccess,
    resetPasswordSubmitFailure,
} from "app/redux/actions"

const parseError = (err) => (
    (err.message === "Network Error")
        ? "Please check your Internet connection and try again"
        : err.response.data.message
)

function* signIn(action) {
    const { credentials } = action.payload

    try {
        const response = yield call(POST, SIGN_IN_API, credentials)
        yield put(signInSuccess(response.data.user))
        yield put(changeScene("app", "/"))

        if (__NATIVE__) call(require("react-native-cookies").setFromResponse, HOST, response)
    }
    catch (err) {
        yield put(signInFailure(parseError(err)))
        yield put(setValidationErrors(null))
    }
}

function* signOut() {
    try {
        const response = yield call(GET, SIGN_OUT_API)
        yield put(signOutSuccess())
        yield put(changeScene("signIn", "/signIn"))

        // Delete JWT in Native platform
        if (__NATIVE__) call(require("react-native-cookies").setFromResponse, HOST, response)
    }
    catch (err) {
        yield put(signOutFailure(parseError(err)))
    }
}

function* register(action) {
    const { credentials } = action.payload

    try {
        const response = yield call(POST, REGISTER_API, credentials)
        yield put(registerSuccess())
        yield put(changeScene("activate", "/signIn", { uid: response.data.uid }))
    }
    catch (err) {
        yield put(registerFailure(parseError(err)))
        yield put(setValidationErrors(null))
    }
}

function* activate(action) {
    const { uid, token } = action.payload
    try {
        const response = yield call(POST, ACTIVATE_API, { uid, token })
        yield put(activateSuccess(response.data.user))
        yield put(changeScene("app", "/"))

        if (__NATIVE__) call(require("react-native-cookies").setFromResponse, HOST, response)
    }
    catch (err) {
        yield put(activateFailure(parseError(err)))
    }
}

function* resetToken(action) {
    const { uid } = action.payload

    try {
        yield call(POST, RESET_TOKEN_API, { uid })
        yield put(resetTokenSuccess())
    }
    catch (err) {
        yield put(resetTokenFailure(parseError(err)))
    }
}

function* resetPassword(action) {
    const { email } = action.payload

    try {
        yield call(POST, RESET_PASSWORD_API, { email })
        yield put(resetPasswordSuccess())
        yield put(setAlert("We've sent you an email with a link to reset your password"))
        yield put(changeScene("signIn", "/signIn"))
    }
    catch (err) {
        yield put(resetPasswordFailure(parseError(err)))
    }
}

function* resetPasswordSubmit(action) {
    const { password, uid, token } = action.payload

    try {
        yield call(POST, RESET_PASSWORD_API, { password, uid, token })
        yield put(resetPasswordSubmitSuccess())
    }
    catch (err) {
        yield put(resetPasswordSubmitFailure(parseError(err)))
    }
}

export default function* authSaga() {
    yield [
        takeLatest(SIGN_IN_REQUEST, signIn),
        takeLatest(SIGN_OUT_REQUEST, signOut),
        takeLatest(REGISTER_REQUEST, register),
        takeLatest(ACTIVATE_REQUEST, activate),
        takeLatest(RESET_TOKEN_REQUEST, resetToken),
        takeLatest(RESET_PASSWORD_REQUEST, resetPassword),
        takeLatest(RESET_PASSWORD_SUBMIT_REQUEST, resetPasswordSubmit),
    ]
}
