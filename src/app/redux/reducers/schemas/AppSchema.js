import { fromJS } from "immutable"
import { MAP, OBJECT, STRING } from "app/common/constants"

const AppSchema = fromJS({
    alert: {
        type: MAP,
        defaultValue: {
            message: {
                type: STRING,
                defaultValue: null,
            },
        },
    },
    scene: {
        type: MAP,
        defaultValue: {
            id: {
                type: STRING,
                defaultValue: null,
            },
            path: {
                type: STRING,
                defaultValue: null,
            },
            passProps: {
                type: OBJECT,
                defaultValue: {},
            },
        },
    },
})

export default AppSchema
