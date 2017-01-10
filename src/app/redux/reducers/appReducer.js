import {
    SIGN_IN_FAILURE,
    REGISTER_FAILURE,
    SIGN_OUT_FAILURE,
    ACTIVATE_FAILURE,
    CHANGE_SCENE,
    SET_ALERT,
} from "app/common/constants"
import { app as AppSchema } from "app/redux/reducers/schemas"
import stateFactory from "app/redux/reducers/stateFactory"

const factory = stateFactory(AppSchema)

export default (state = factory.createState({}), action = {}) => {
    switch (action.type) {
        // Authentication reducer
        case SIGN_IN_FAILURE:
        case REGISTER_FAILURE:
        case SIGN_OUT_FAILURE:
        case ACTIVATE_FAILURE:
        {
            const { message } = action.error
            return factory.setField(state, ["alert", "message"], message)
        }
        // Scene reducer
        case CHANGE_SCENE:
        {
            const { id, path, passProps } = action.payload
            return factory.setFields(state, [
                [ ["scene", "id"], id ],
                [ ["scene", "path"], path ],
                [ ["scene", "passProps"], passProps ],
            ])
        }
        // Alert reducer
        case SET_ALERT:
        {
            const { message } = action.payload
            return factory.setField(state, ["alert", "message"], message)
        }
        default:
            return state
    }
}
