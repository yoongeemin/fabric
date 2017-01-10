import { takeEvery } from "redux-saga"
import { call, put } from "redux-saga/effects"
import { POST } from "app/common/http"

function* user() {
    try {
        // TODO: all csrf flag should depend on PLATFORM == WEB
        const response = yield call(POST, "http://localhost:8080/api/user", {}, true)
    }
    catch (err) {
        console.log(err)
    }
}

export default function* appSaga() {
    yield [
        takeEvery("GET_USER_REQUEST", user),
    ]
}
