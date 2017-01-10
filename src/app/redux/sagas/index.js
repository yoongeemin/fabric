import _ from "lodash"
import { fork } from "redux-saga/effects"
import authSaga from "app/redux/sagas/authSaga"
import appSaga from "app/redux/sagas/appSaga"

export default function* sagas() {
    yield _.map(
        [
            appSaga,
            authSaga,
        ],
        (saga) => fork(saga)
    )
}
