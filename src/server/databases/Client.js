/**
 * Database client
 */

import _ from "lodash"
import { delay } from "bluebird"
import { ConnectionError } from "server/lib/errors"
import logger from "server/instances/logger"
import { FAILED } from "server/lib/constants"

export default class Client {
    /**
     * Constructor
     * @param {String} name - Database name
     * @param {String} host - Database host
     * @param {Number} port - Database port
     * @param {String} path - Database path
     * @param {Number} retries - Maximum number of retries
     * @param {Number} delay - Retry delay (microseconds)
     */
    constructor(name, host, port, path, retries, delay) {
        this._connection = null
        this._name = name
        this._host = host
        this._port = port
        this._path = path
        this._retries = retries
        this._delay = delay
    }

    /**
     * Getter for name
     * @returns {String} Name
     */
    get name() {
        return this._name
    }

    /**
     * Get connection state
     * @returns {boolean} Connection state
     */
    isConnected() {
        return (this._connection !== null)
    }

    /**
     * Asynchronously connect with retry
     * @param {Number} retry - Current retry count
     * @returns {Promise} Client
     * @throws {ConnectionError} Retry count should not exceed maximum retry counts
     */
    connectWithRetry(retry = 1) {
        const _this = this
        return _this.connect().catch(() => {
            logger.notice(`[${_this._name}] Retrying (${retry}) in ${_this._delay / 1000} seconds`)
            if (retry >= _this._retries)
                throw new ConnectionError(_this._name, FAILED, "Retry attempt exceeded")
            return delay(_this._delay).then(() => _this.connectWithRetry(retry + 1))
        })
    }

    /**
     * Disconnect handler
     * @param {Function} callback - Callback function called on disconnect
     * @param {Function} cleanup - Cleanup function called on disconnect
     * @param {String} signal - Disconnect signal emitted on disconnect
     */
    onDisconnect(callback, signal) {
        const _this = this
        if (_this._connection && _.isEmpty(_this._connection.listeners(signal))) {
            _this._connection.on(signal, () => {
                _this.close()
                callback()
            })
        }
    }
}
