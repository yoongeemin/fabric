import { combineReducers } from "redux-immutable"
import authReducer from "app/redux/reducers/authReducer"
import routeReducer from "app/redux/reducers/routeReducer"
import appReducer from "app/redux/reducers/appReducer"

const reducers = combineReducers({
    app: appReducer,
    auth: authReducer,
    route: routeReducer,
})

export default reducers
