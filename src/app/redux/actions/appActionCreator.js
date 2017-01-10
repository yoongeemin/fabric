import { CHANGE_SCENE, SET_ALERT } from "app/common/constants"

export const getUser = () =>
    ({
        type: "GET_USER_REQUEST",
    })

export const changeScene = (id, path = null, passProps = {}) =>
    ({
        type: CHANGE_SCENE,
        payload: { id, path, passProps },
    })

export const setAlert = (message) =>
    ({
        type: SET_ALERT,
        payload: { message },
    })
