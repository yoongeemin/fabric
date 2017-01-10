import { reject, resolve } from "Bluebird"
import chai, { assert } from "chai"
import chaiAsPromised from "chai-as-promised"
import { spy, stub } from "sinon"
import EventEmitter from "events"
import KoaServer from "server/server/KoaServer"
import { ConnectionError } from "server/lib/errors"

class MockService {
    get name() { return "MockService" }
    connect() { }
    connectWithRetry() { }
    isConnected() { }
    close() { }
    onDisconnect() { }
}

describe("KoaServer", () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.should()
    })

    it("starts server", (done) => {
        const server = new KoaServer()

        server.start().should.be.fulfilled.and.notify(() => {
            server.close()
            done()
        })
    })

    it("starts server with middleware", (done) => {
        const middleware = (s) => s
        const server = new KoaServer([middleware])

        server.start().should.be.fulfilled.and.notify(() => {
            server.close()
            done()
        })
    })

    it("connects to all valid services", (done) => {
        const service1 = new MockService()
        stub(service1, "connect", () => resolve(service1))
        stub(service1, "isConnected", () => true)

        const service2 = new MockService()
        stub(service2, "connect", () => resolve(service2))
        stub(service2, "isConnected", () => true)

        const server = new KoaServer([], [service1, service2])

        server.start().should.be.fulfilled.and.notify(() => {
            server.close()
            done()
        })
    })

    it("retries connection n times when a service is down", (done) => {
        const service1 = new MockService()
        stub(service1, "connect", () => resolve(service1))
        stub(service1, "isConnected", () => true)

        const service2 = new MockService()
        stub(service2, "connect", () => reject(service2))
        stub(service2, "isConnected", () => false)

        const RECONNECT_RETRIES = 5
        const RECONNECT_DELAY = 0

        const server = new KoaServer([], [service1, service2], RECONNECT_RETRIES, RECONNECT_DELAY)

        spy(server, "connectAll")
        server.start().should.be.rejectedWith(ConnectionError).and.notify(() => {
            assert.equal(server.connectAll.callCount, RECONNECT_RETRIES)
            server.connectAll.restore()
            server.close()
            done()
        })
    })

    it("calls disconnect handler on service disconnect", (done) => {
        const service1 = new MockService()
        const emitter = new EventEmitter()
        stub(service1, "connect", () => resolve(service1))
        stub(service1, "connectWithRetry", () => resolve(service1))
        stub(service1, "isConnected", () => true)
        stub(service1, "onDisconnect", (callback) => emitter.on("close", () => callback()))

        const server = new KoaServer([], [service1])

        spy(server, "handleDisconnect")
        server.start().should.be.fulfilled.and.notify(() => {
            // Simulate service disconnect
            emitter.emit("close")

            // Check disconnect handler was called
            assert(server.handleDisconnect.calledOnce)

            server.handleDisconnect.restore()
            server.close()
            done()
        })
    })
})
