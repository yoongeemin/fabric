/**
 * Email transporter
 */

import { createTransport } from "nodemailer"
import smtpTransport from "nodemailer-smtp-transport"
import Bluebird from "bluebird"
import { HttpError, ConnectionError } from "server/lib/errors"
import { SERVICE_UNAVAILABLE } from "server/lib/constants"

export default class EmailTransporter {
    /**
     * Constructor
     */
    constructor() {
        this._name = "Email Transporter"
        this._transporter = null
        this._user = null
    }

    /**
     * Get connection state
     * @returns {boolean} Connection state
     */
    isConnected() {
        return (this._transporter !== null)
    }

    /**
     * Connects to SMTP transport
     * @param {String} host - SMTP host
     * @param {Number} port - SMTP port
     * @param {String} user - SMTP user
     * @param {String} pass - SMTP password
     * @param secureConnection
     * @returns {Promise} Response
     */
    connect(
        host = process.env.SMTP_HOST,
        port = process.env.SMTP_PORT,
        user = process.env.SMTP_USER,
        pass = process.env.SMTP_PASSWORD,
        secureConnection = false
    ) {
        const _this = this
        return new Bluebird((resolve, reject) => {
            _this._user = user

            if (_this._transporter) return resolve(_this._transporter)

            const transport = smtpTransport({
                host,
                port,
                auth: { user, pass },
                secureConnection,
            })

            transport.verify((err) => {
                if (err) return reject(new ConnectionError(_this._name, "ERROR", err.message))
                _this._transporter = createTransport(transport)
                return resolve(_this._transporter)
            })
        })
    }

    /**
     * Sends email
     * @param {String} to - Recipient
     * @param {String} subject - Email subject
     * @param {String} html - Email content
     * @returns {Promise} Response
     */
    sendEmail(to, subject, html) {
        const _this = this
        if (_this._transporter) {
            return new Bluebird((resolve, reject) => {
                _this._transporter.sendMail({
                    from: _this._user,
                    to,
                    subject,
                    html,
                }, (err, info) => {
                    if (err) return reject(err)
                    if (!info) {
                        return reject(
                            new HttpError(
                                SERVICE_UNAVAILABLE,
                                "Please check your Internet connection and try again",
                            )
                        )
                    }
                    return resolve(info.response)
                })
            })
        }
        throw new Error("Transporter is not connected")
    }

    /**
     * Closes SMTP transport
     */
    close() {
        if (this._transporter) {
            this._transporter.close()
            this._transporter = null
        }
        else throw Error("Transport is already closed")
    }
}
