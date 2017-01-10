import { assert } from "chai"
import HttpError from "server/lib/errors/HttpError"
import { UNAUTHORIZED } from "server/lib/constants"

describe("HttpError", () => {
    const STATUS = UNAUTHORIZED
    const MESSAGE = "Unauthorized"
    const httpError = new HttpError(STATUS, MESSAGE)

    it("has the correct name", () => {
        assert.equal(httpError.name, "HttpError")
    })

    it("has the correct errno", () => {
        assert.equal(httpError.errno, "HTTP")
    })

    it("has the correct status", () => {
        assert.equal(httpError.status, STATUS)
    })

    it("has the correct message", () => {
        assert.equal(httpError.message, MESSAGE)
    })
})
