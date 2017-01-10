import { assert } from "chai"
import ConnectionError from "server/lib/errors/ConnectionError"

describe("ConnectionError", () => {
    const SERVICE = "SERVICE"
    const STATUS = "FAIL"
    const MESSAGE = "Fail"
    const connectionError = new ConnectionError(SERVICE, STATUS, MESSAGE)

    it("has the correct name", () => {
        assert.equal(connectionError.name, "ConnectionError")
    })

    it("has the correct errno", () => {
        assert.equal(connectionError.errno, "CONNECTION")
    })

    it("has the correct service", () => {
        assert.equal(connectionError.service, SERVICE)
    })

    it("has the correct status", () => {
        assert.equal(connectionError.status, STATUS)
    })

    it("has the correct message", () => {
        assert.equal(connectionError.message, MESSAGE)
    })
})
