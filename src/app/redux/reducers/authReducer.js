import { Map } from "immutable"
import { auth as AuthSchema } from "app/redux/reducers/schemas"
import stateFactory from "app/redux/reducers/stateFactory"
import {
    FIELD_CHANGE,
    SET_VALIDATION_ERRORS,
    RESET_FORM,
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
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_SUBMIT_REQUEST,
    RESET_PASSWORD_SUBMIT_SUCCESS,
    RESET_PASSWORD_SUBMIT_FAILURE,
} from "app/common/constants"

const factory = stateFactory(AuthSchema)
export default (state = factory.createState({}), action = {}) => {
    switch (action.type) {
        // Authentication reducer
        case SIGN_IN_REQUEST:
        case REGISTER_REQUEST:
        case SIGN_OUT_REQUEST:
        case ACTIVATE_REQUEST:
        case RESET_PASSWORD_REQUEST:
        case RESET_PASSWORD_SUBMIT_REQUEST:
        {
            return factory.setField(state, ["form", "loading"], true)
        }
        case SIGN_IN_SUCCESS:
        case ACTIVATE_SUCCESS:
        {
            const { user } = action.payload
            return factory.setFields(state, [
                [ ["authenticated"], true ],
                [ ["user"], user ],
                [ ["form"] ],
            ])
        }
        case SIGN_OUT_SUCCESS:
        {
            return factory.setFields(state, [
                [ ["authenticated"], false ],
                [ ["user"] ],
                [ ["form"] ],
            ])
        }
        case REGISTER_SUCCESS:
        case RESET_PASSWORD_SUCCESS:
        case RESET_PASSWORD_SUBMIT_SUCCESS:
        {
            return factory.setField(state, ["form"])
        }
        case SIGN_IN_FAILURE:
        case REGISTER_FAILURE:
        case SIGN_OUT_FAILURE:
        case ACTIVATE_FAILURE:
        case RESET_PASSWORD_FAILURE:
        case RESET_PASSWORD_SUBMIT_FAILURE:
        {
            return factory.setField(state, ["form", "loading"], false)
        }

        // Form reducer
        case FIELD_CHANGE:
        {
            const { field, value } = action.payload
            return factory.setField(state, ["form", "fields", field], value)
        }
        case RESET_FORM:
        {
            return factory.setField(state, ["form"])
        }
        case SET_VALIDATION_ERRORS:
        {
            const { errors } = action.payload
            return factory.setField(state, ["form", "validationErrors"], Map(errors))
        }
        default:
            return state
    }
}
