import { assert } from "chai"
import Logger from "server/logger/Logger"

describe("logger", () => {
    let logger
    before(() => {
        logger = new Logger(true)
    })

    it("logs with correct level and message", (done) => {
        const LEVEL = "info"
        const MESSAGE = "test message"

        logger.on("logged", (level, msg) => {
            assert.equal(level, LEVEL)
            assert.equal(msg, MESSAGE)
            done()
        })

        logger[LEVEL](MESSAGE)
    })
})
