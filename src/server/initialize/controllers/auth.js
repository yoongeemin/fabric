import passport from "koa-passport"
import { User } from "server/models"
import emailTransporter from "server/instances/emailTransporter"
import { HttpError } from "server/lib/errors"
import { genJWT, verifyJWT } from "server/lib/crypt"
import {
    HOST,
    OK,
    CONFLICT,
    BAD_REQUEST,
    UNAUTHORIZED,
    JWT_ACTIVATE_EMAIL_TTL,
    JWT_RESET_PASSWORD_TTL,
} from "server/lib/constants"

const COOKIE_RESET_OPTIONS = {
    expires: new Date(1),
    overwrite: true,
    path: "/",
}

export const signIn = async (ctx, next) =>
    await passport.authenticate("local", async (user) => {
        if (!user) throw new HttpError(UNAUTHORIZED, "Invalid user or password")
        await ctx.login(user)
        user.sessions.push(`sid:${ctx.sessionId}`)
        await user.save()
        ctx.status = OK
    })(ctx, next)


export const signOut = async (ctx) => {
    await ctx.logout()
    ctx.session = null
    ctx.cookies.set("sid", null, COOKIE_RESET_OPTIONS)
    ctx.cookies.set("sid.sig", null, COOKIE_RESET_OPTIONS)
    ctx.status = OK
}


export const register = async (ctx) => {
    const { email, mobile, password } = ctx.request.body
    let user = await User.findOne({ $or: [{ "email.value": email }, { "mobile.value": mobile }] }).exec()
    if (user) throw new HttpError(CONFLICT, "Email or phone number already exists")

    user = new User({
        "email.value": email,
        // "mobile.value": mobile,
        password,
    })

    // Activation JWT
    const jwt = await genJWT({
        claim: { uid: user._id.toString() },
        expiresIn: JWT_ACTIVATE_EMAIL_TTL,
    })

    const link = `${HOST}/verify/email/${jwt}`
    const context = { appname: process.env.APP_NAME, link }
    await ctx.render("verify.email.hjs", context)
    await emailTransporter.sendEmail({
        host:     process.env.SMTP_HOST,
        port:     process.env.SMTP_PORT,
        user:     process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
        to:       user.email.value,
        subject:  "Activate Your Account",
        html:     ctx.body,
    })

    await user.save()

    ctx.status = OK
}


export const verifyEmail = async (ctx) => {
    const { jwt } = ctx.request.body

    if (!jwt) throw new HttpError(BAD_REQUEST, "Token does not exist")

    const claim = await verifyJWT({ jwt })
    const user = await User.findOne({ _id: claim.uid }).exec()
    if (!user.email.activated) user.email.activated = true
    await user.save()

    ctx.status = OK
}


// export const resetToken = async (ctx) => {
//     const { uid } = ctx.request.body
//
//     const user = await User.findOne({ _id: uid }).exec()
//
//     if (!user) {
//         throw new HttpError(
//             "Failed to reset token",
//             UNAUTHORIZED
//         )
//     }
//
//     user.token = await randomNumber(ACTIVATE_TOKEN_LENGTH)
//     user.tokenExpiration = Date.now() + ACTIVATE_TOKEN_EXPIRE
//     await user.save()
//     ctx.status = OK
// }

// export const validatePasswordResetToken = async (ctx) => {
//     const { uid, token } = ctx.request.query
//     if (uid && mongoose.Types.ObjectId.isValid(uid) && token) {
//         const user = await User.findOne({
//             _id: uid,
//             token,
//             tokenExpiration: { $gt: Date.now() },
//         }).exec()
//
//         if (!user) {
//             throw new HttpError(
//                 "Password reset token does not exist or has expired",
//                 NOT_FOUND
//             )
//         }
//
//         ctx.status = OK
//     }
// }

export const resetPassword = async (ctx) => {
    /**
     * Send password reset email
     */
    const { email } = ctx.request.body
    if (email) {
        const user = await User.findOne({ "email.value": email }).exec()
        if (!user) throw new HttpError(UNAUTHORIZED, "Email does not exist")

        // Password reset JWT
        const jwt = await genJWT({
            claim: { uid: user._id.toString() },
            expiresIn: JWT_RESET_PASSWORD_TTL,
        })

        const link = `${HOST}/reset/password/${jwt}`
        const context = { appname: process.env.APP_NAME, link }
        await ctx.render("reset.password.hjs", context)
        await emailTransporter.sendEmail({
            host:     process.env.SMTP_HOST,
            port:     process.env.SMTP_PORT,
            user:     process.env.SMTP_USER,
            password: process.env.SMTP_PASSWORD,
            to:       user.email.value,
            subject: "Reset Your Password",
            html:    ctx.body,
        })
    }

    /**
     * Password reset submit
     */
    else {
        const { jwt, password } = ctx.request.body
        if (!jwt) throw new HttpError(BAD_REQUEST, "Token does not exist")

        const claim = await verifyJWT({ jwt })
        const user = await User.findOne({ _id: claim.uid }).exec()
        if (!user) throw new HttpError(BAD_REQUEST, "User does not exist")
        user.password = password
        await user.save()
        ctx.status = OK
    }
}
