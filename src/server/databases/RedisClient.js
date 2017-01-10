/**
 * Redis client
 */

import Bluebird from "bluebird"
import { createClient } from "redis"
import { ConnectionError } from "server/lib/errors"
import Client from "server/databases/Client"
import { ALREADY_CLOSED, FAILED } from "server/lib/constants"

const RECONNECT_RETRIES = 10
const RECONNECT_DELAY = 5000 // 5 seconds

export default class RedisClient extends Client {
    /**
     * Constructor
     * @param {String} host - Database host
     * @param {Number} port - Database port
     * @param {String} path - Database path
     * @param {Number} retries - Maximum number of retries
     * @param {Number} delay - Retry delay (microseconds)
     */
    constructor(
        host    = process.env.REDIS_HOST,
        port    = process.env.REDIS_PORT,
        path    = process.env.REDIS_PATH,
        retries = RECONNECT_RETRIES,
        delay   = RECONNECT_DELAY
    ) {
        super("Redis", host, port, path, retries, delay)
    }

    /**
     * Asynchronously connect
     * @returns {Promise} Redis connection
     */
    connect() {
        const _this = this
        return new Bluebird((resolve, reject) => {
            if (_this._connection) return resolve(_this)

            const client = createClient(
                {
                    host: _this._host,
                    port: _this._port,
                    path: _this._path,
                    retry_strategy: () => {
                        _this._connection = null
                        const error = new ConnectionError(_this._name, FAILED, "Connection failed")
                        reject(error)
                        return error
                    },
                }
            )

            client
                .on("connect", () => {
                    _this._connection = client
                    return resolve(_this)
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
            "end"
        )
    }

    /**
     * Close connection
     */
    close() {
        if (this._connection) {
            this._connection.quit()
            this._connection = null
        }
        else throw new ConnectionError(this._name, ALREADY_CLOSED, "Transport is already closed")
    }
}
