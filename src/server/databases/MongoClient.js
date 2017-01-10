/**
 * Mongo client
 */

import Bluebird from "bluebird"
import mongoose from "mongoose"
import { ConnectionError } from "server/lib/errors"
import Client from "server/databases/Client"
import { ALREADY_CLOSED, FAILED } from "server/lib/constants"

const CONNECTION_OPTIONS = {
    auto_reconnect: false,
}
const RECONNECT_RETRIES = 10
const RECONNECT_DELAY = 5000 // 5 seconds

mongoose.Promise = Bluebird

export default class MongoClient extends Client {
    /**
     * Constructor
     * @param {String} host - Database host
     * @param {Number} port - Database port
     * @param {String} path - Database path
     * @param {Number} retries - Maximum number of retries
     * @param {Number} delay - Retry delay (microseconds)
     */
    constructor(
        host    = process.env.MONGO_HOST,
        port    = process.env.MONGO_PORT,
        path    = process.env.MONGO_PATH,
        retries = RECONNECT_RETRIES,
        delay   = RECONNECT_DELAY
    ) {
        super("Mongo", host, port, path, retries, delay)
    }

    /**
     * Asynchronously connect
     * @returns {Promise} Mongo client
     */
    connect() {
        const _this = this
        return new Bluebird((resolve, reject) => {
            if (_this._connection) return resolve(_this)

            const MONGO_URI = `mongodb://${_this._host}:${_this._port}/${_this._path}`
            mongoose
                .connect(
                    MONGO_URI,
                    { server:  CONNECTION_OPTIONS, replset: CONNECTION_OPTIONS }
                )
                .then(() => {
                    _this._connection = mongoose.connection
                    return resolve(_this)
                })
                .catch((err) => {
                    mongoose.disconnect()
                    _this._connection = null
                    return reject(new ConnectionError(_this._name, FAILED, err.message))
                })
        })
    }

    /**
     * Disconnect handler
     * @param {Function} callback - Callback function called on disconnect
     */
    onDisconnect(callback) {
        super.onDisconnect(
            callback,
            "close"
        )
    }

    /**
     * Close connection
     */
    close() {
        if (this._connection) {
            mongoose.disconnect()
            this._connection = null
        }
        else throw new ConnectionError(this._name, ALREADY_CLOSED, "Transport is already closed")
    }
}
