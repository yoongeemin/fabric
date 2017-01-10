import { GET } from "app/common/http"
import { RESET_PASSWORD_API } from "app/common/constants"

const loadAsync = (callback) => (component) => callback(null, component.default || component)

const configureRoutes = (store) => ({
    path: "/",
    component: require("../components/App").default,
    indexRoute: {
        getComponent: (location, callback) => (
            (store.getState().get("auth").get("authenticated"))
                ? System.import("app/web/containers/Test").then(loadAsync(callback))
                : System.import("app/web/containers/SignIn").then(loadAsync(callback))
        ),
    },
    childRoutes: [
        {
            path: "/signIn",
            getComponent: (location, callback) => System.import("app/web/containers/SignIn").then(loadAsync(callback)),
        },
        {
            path: "/reset/password/:uid/:token",
            getComponent: (location, callback) => {
                const { uid, token } = location.params
                GET(RESET_PASSWORD_API, { uid, token })
                    .then(() => System.import("app/web/containers/PasswordResetSubmit").then(loadAsync(callback)))
                    .catch(() => System.import("app/web/components/PasswordResetExpired").then(loadAsync(callback)))
            },
        },
        {
            path: "/verify/email/:jwt",
            getComponent: (location, callback) => System.import("app/web/components/VerifyEmail").then(loadAsync(callback)),
        },
        {
            path: "*",
            getComponent: (location, callback) => System.import("app/web/components/NotFound").then(loadAsync(callback)),
        },
    ],
})

export default configureRoutes
