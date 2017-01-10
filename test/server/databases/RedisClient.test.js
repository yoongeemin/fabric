import chai, { assert } from "chai"
import chaiAsPromised from "chai-as-promised"
import { spy } from "sinon"
import ConnectionError from "server/lib/errors/ConnectionError"
import RedisClient from "server/databases/RedisClient"

describe("RedisClient", () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.should()
    })

    it("has the correct name", () => {
        const redis = new RedisClient()
        assert.equal(redis.name, "Redis")
    })

    it("throws error with invalid parameters", () => {
        const HOST = "INVALID_HOST"
        const PORT = 0
        const PATH = "INVALID_PATH"
        const redis = new RedisClient(HOST, PORT, PATH)

        return redis.connect().should.be.rejected
    })

    it("throws error when attempting to close nonexistent connection", () => {
        const redis = new RedisClient()

        assert.isFalse(redis.isConnected())
        assert.throws(() => redis.close(), ConnectionError)
    })

    it("retries connection n times", (done) => {
        const HOST = "INVALID_HOST"
        const PORT = 0
        const PATH = "INVALID_PATH"
        const RETRIES = 5
        const DELAY = 0
        const redis = new RedisClient(HOST, PORT, PATH, RETRIES, DELAY)

        spy(redis, "connect")
        redis.connectWithRetry().should.be.rejected.and.notify(() => {
            assert.equal(redis.connect.callCount, RETRIES)
            redis.connect.restore()
            done()
        })
    })
})
