import chai, { assert } from "chai"
import chaiAsPromised from "chai-as-promised"
import { spy } from "sinon"
import ConnectionError from "server/lib/errors/ConnectionError"
import MongoClient from "server/databases/MongoClient"

describe("MongoClient", () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.should()
    })

    it("has the correct name", () => {
        const mongo = new MongoClient()
        assert.equal(mongo.name, "Mongo")
    })

    it("throws error with invalid parameters", () => {
        const HOST = "INVALID_HOST"
        const PORT = 0
        const PATH = "INVALID_PATH"
        const mongo = new MongoClient(HOST, PORT, PATH)

        return mongo.connect().should.be.rejectedWith(ConnectionError)
    })

    it("throws error when attempting to close nonexistent connection", () => {
        const mongo = new MongoClient()

        assert.isFalse(mongo.isConnected())
        assert.throws(() => mongo.close(), ConnectionError)
    })

    it("retries connection n times", (done) => {
        const HOST = "INVALID_HOST"
        const PORT = 0
        const PATH = "INVALID_PATH"
        const RECONNECT_RETRIES = 5
        const RECONNECT_DELAY = 0
        const mongo = new MongoClient(HOST, PORT, PATH, RECONNECT_RETRIES, RECONNECT_DELAY)

        spy(mongo, "connect")
        mongo.connectWithRetry().should.be.rejectedWith(ConnectionError).and.notify(() => {
            assert.equal(mongo.connect.callCount, RECONNECT_RETRIES)
            mongo.connect.restore()
            done()
        })
    })
})
