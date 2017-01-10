import chai, { assert } from "chai"
import chaiAsPromised from "chai-as-promised"
import { ConnectionError } from "server/lib/errors"
import EmailTransporter from "server/lib/transporters/EmailTransporter"

describe("emailTransporter", () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.should()
    })

    // it("throws error with invalid parameters", (done) => {
    //     const HOST = "INVALID_HOST"
    //     const PORT = 0
    //     const USER = "INVALID_USER"
    //     const PASSWORD = "INVALID_PASSWORD"
    //
    //     const emailTransporter = new EmailTransporter()
    //     emailTransporter.connect(HOST, PORT, USER, PASSWORD, false).should.be.rejectedWith(ConnectionError)
    //         .and.notify(() => {
    //             assert.isFalse(emailTransporter.isConnected())
    //             done()
    //         })
    // })
})
