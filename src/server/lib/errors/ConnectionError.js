/**
 * Connection Error
 */

/**
 * Connection error
 * @param service - Service name
 * @param status - Connection status
 * @param message - Error message
 */
function ConnectionError(service, status, message) {
    Object.defineProperty(this, "name", {
        enumerable: false,
        writable: false,
        value: "ConnectionError",
    })

    Object.defineProperty(this, "errno", {
        enumerable: false,
        writable: true,
        value: "CONNECTION",
    })

    Object.defineProperty(this, "service", {
        enumerable: false,
        writable: true,
        value: service,
    })

    Object.defineProperty(this, "status", {
        enumerable: false,
        writable: true,
        value: status,
    })

    Object.defineProperty(this, "message", {
        enumerable: false,
        writable: true,
        value: message,
    })

    Object.defineProperty(this, "stack", {
        enumerable: false,
        writable: true,
        value: new Error(message).stack,
    })
}

Object.setPrototypeOf(ConnectionError.prototype, Error.prototype)

export default ConnectionError
