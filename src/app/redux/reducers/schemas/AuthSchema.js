import { fromJS } from "immutable"
import { BOOLEAN, MAP } from "app/common/constants"

const AuthSchema = fromJS({
    user: {
        type: MAP,
        defaultValue: {},
    },
    authenticated: {
        type: BOOLEAN,
        defaultValue: false,
    },
    form: {
        type: MAP,
        defaultValue: {
            loading: {
                type: BOOLEAN,
                defaultValue: false,
            },
            fields: {
                type: MAP,
                defaultValue: {},
            },
            validationErrors: {
                type: MAP,
                defaultValue: {},
            },
        },
    },
})

export default AuthSchema
