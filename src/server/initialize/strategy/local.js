import { Strategy }  from "passport-local"
import { User } from "server/models"
import { compare } from "server/lib/crypt"
import { HttpError } from "server/lib/errors"
import { UNAUTHORIZED } from "server/lib/constants"

const local = new Strategy(
    {
        usernameField: "emailorphone",
        passwordField: "password",
    },
    (emailorphone, password, done) =>
        User.findOne({ $or: [{ "email.value": emailorphone }, { "mobile.value": emailorphone }] }).exec()
            .then((user) => {
                if (user) {
                    return compare(password, user.password)
                        .then((match) => (
                            (match)
                                ? done(null, user)
                                : done(
                                    new HttpError("Invalid user or password", UNAUTHORIZED),
                                    null
                                )
                        ))
                }

                return done(
                    new HttpError("Email or phone number does not exist", UNAUTHORIZED),
                    null
                )
            })
            .catch((err) => done(err, null))
)

export default local
