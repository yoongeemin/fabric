/**
 * HTTP error
 */

/**
 * HTTP error
 * @param {String} status - HTTP status
 * @param {String} message - Error message
 */
function HttpError(status, message) {
    Object.defineProperty(this, "name", {
        enumerable: false,
        writable: false,
        value: "HttpError",
    })

    Object.defineProperty(this, "errno", {
        enumerable: false,
        writable: true,
        value: "HTTP",
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

Object.setPrototypeOf(HttpError.prototype, Error.prototype)

export default HttpError
