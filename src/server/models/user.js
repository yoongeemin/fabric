/**
 * Mongo schema for user
 */

import mongoose from "mongoose"
import { genSalt, hash } from "server/lib/crypt"
import { PASSWORD_SALT_ROUNDS } from "server/lib/constants"

const UserSchema = new mongoose.Schema({
    email: {
        value : {
            type: String,
            required: true,
            unique: true,
        },
        activated: {
            type: Boolean,
            required: false,
        },
    },
    mobile: {
        value: {
            type: String,
            required: false,
            unique: true,
        },
        activated: {
            type: Boolean,
            required: false,
        },
    },
    password: {
        type: String,
        required: true,
    },
    sessions: [String],
})

/**
 * Hash user password
 */
UserSchema.pre("save", async function(done) {
    // Only hash the password if it has been added or modified
    if (!this.isModified("password")) done()

    try {
        const salt = await genSalt(PASSWORD_SALT_ROUNDS)
        this.password = await hash(this.password, salt)
        done()
    }
    catch (err) { done(err) }
})

const User = mongoose.model("User", UserSchema)

export default User
