import _ from "lodash"
import { List, Map, fromJS } from "immutable"
import { LIST, MAP } from "app/common/constants"

const struct = (schema, object) =>
    schema.reduce((result, value, key) => {
        const type = value.get("type")
        const defaultValue = value.get("defaultValue")
        const objectValue = _.get(object, key, defaultValue)

        switch (type) {
            case LIST:
            {
                result[key] = List(objectValue)
                break
            }
            case MAP:
            {
                const state = (defaultValue) ? struct(defaultValue, objectValue) : {}
                result[key] = Map(state)
                break
            }
            default:
            {
                result[key] = objectValue
                break
            }
        }
        return result
    }, {})

const stateFactory = (schema) => ({
    createState: (object) => {
        if (schema) {
            const state = struct(schema, object)
            return Map(state)
        }
        return fromJS(object)
    },
    setField: (state, keyPath, value = null) => {
        const field = schema.getIn(keyPath)
        if (field) {
            const type = field.get("type")
            const defaultValue = field.get("defaultValue")
            const objectValue =  _.isNull(value) ? defaultValue : value

            switch (type) {
                case LIST:
                    return state.setIn(keyPath, List(value))
                case MAP:
                {
                    const objectValue = value || struct(defaultValue, {})
                    return state.setIn(keyPath, Map(objectValue))
                }
                default:
                    return state.setIn(keyPath, objectValue)
            }
        }
        else return state.setIn(keyPath, value)
    },
    setFields: function(state, fields = []) { // eslint-disable-line object-shorthand
        const self = this
        _.forEach(fields, (field) => {
            const [ keyPath, value ] = field
            state = self.setField(state, keyPath, value)
        })
        return state
    },
})

export default stateFactory
