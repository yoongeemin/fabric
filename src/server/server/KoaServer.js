/**
 * KOA server
 */

import _ from "lodash"
import Koa from "koa"
import { all, delay } from "bluebird"
import logger from "server/instances/logger"
import { RETRY_ATTEMPT_EXCEEDED } from "server/lib/constants"
import { ConnectionError } from "server/lib/errors"

const LOGGER = "SERVER"
const RECONNECT_RETRIES = 10
const RECONNECT_DELAY = 5000 // 5 seconds

export default class KoaServer {
    /**
     * Constructor
     * @param {Array} middlewares
     * @param {Array} services
     * @param {Number} retries - Maximum number of retries
     * @param {Number} reconnectDelay - Retry delay (microseconds)
     */
    constructor(
        middlewares = [],
        services = [],
        retries = RECONNECT_RETRIES,
        reconnectDelay = RECONNECT_DELAY
    ) {
        this._server = null
        this._middlewares = middlewares
        this._services = services
        this._retries = retries
        this._delay = reconnectDelay
    }

    /**
     * Check server status
     * @returns {Boolean} Server is listening
     */
    isListening() {
        return (this._server && this._server.listening)
    }

    /**
     * Asynchronously connect to databases
     * @param {Number} retry - Current retry count
     * @returns {Promise} Connection
     */
    connectAll(retry = 1) {
        const _this = this
        const inspections = _this._services.map((service) => service.connect().reflect())
        return all(inspections)
            .reduce((errs, inspect) => {
                if (inspect.isFulfilled()) {
                    const service = inspect.value()
                    if (service.onDisconnect) {
                        service.onDisconnect(
                            () => _this.handleDisconnect(service)
                        )
                    }
                    return errs
                }
                return errs.concat([inspect.reason().service])
            }, [])
            .then((errs) => {
                if (_.isEmpty(errs)) return null
                if (retry >= _this._retries) throw new ConnectionError("Server", RETRY_ATTEMPT_EXCEEDED, "Retry attempt exceeded")
                logger.error(`[${LOGGER}] Failed to connect to following services. Retrying (${retry}) in ${_this._delay / 1000} seconds: ${errs.join(", ")}`)
                return delay(_this._delay).then(_.bind(_this.connectAll, _this, retry + 1))
            })
    }

    /**
     * Handle client disconnect
     * @param {Object} client - Database client
     */
    handleDisconnect(client) {
        const _this = this
        if (_this.isListening()) {
            logger.error(`[${LOGGER}] Disconnected from following service: ${client.name}`)
            return client.connectWithRetry().then((reconnectedClient) => {
                logger.info(`[${LOGGER}] Reconnected to following service: ${reconnectedClient.name}`)
                reconnectedClient.onDisconnect(() => _this.handleDisconnect(reconnectedClient))
            })
        }
    }

    /**
     * Start server
     */
    start() {
        const server = new Koa()

        const _this = this
        _.forEach(
            _this._middlewares,
            (middleware) => middleware(server)
        )

        return _this.connectAll()
            .then(() => {
                logger.info(`[${LOGGER}] Koa server starting on port: ${process.env.SERVER_PORT}`)
                _this._server = server.listen(process.env.SERVER_PORT)
            })
            .catch((err) => {
                logger.error(`[${LOGGER}] ${err.message}`)
                _this._server = null
            })
    }

    /**
     * Close server
     */
    close() {
        _.forEach(this._services, (service) => {
            if (service.isConnected()) service.close()
        })

        if (this.isListening()) {
            logger.info(`[${LOGGER}] Koa server closing`)
            this._server.close()
            this._server = null
        }
    }
}
