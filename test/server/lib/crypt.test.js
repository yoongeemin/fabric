import chai, { assert } from "chai"
import chaiAsPromised from "chai-as-promised"
import * as crypt from "server/lib/crypt"

describe("crypt", () => {
    before(() => {
        chai.use(chaiAsPromised)
        chai.should()
    })

    describe("JWT", () => {
        const CLAIM = { uid: "test" }

        it("generates JWT", (done) => {
            crypt.genJWT({
                claim: CLAIM,
            }).then((jwt) => {
                assert.isNotNull(jwt)
                done()
            })
        })

        it("throws error with missing claim", () => {
            return crypt.genJWT({}).should.be.rejected
        })

        it("throws error with invalid expiration", () => {
            const EXPIRES_IN = "INVALID_EXPIRATION"

            return crypt.genJWT({
                claim: CLAIM,
                expiresIn: EXPIRES_IN,
            }).should.be.rejected
        })

        it("verifies valid JWT", (done) => {
            const AUDIENCE = "test"
            const EXPIRES_IN = "1h"

            crypt.genJWT({
                claim: CLAIM,
                audience: AUDIENCE,
                expiresIn: EXPIRES_IN,
            }).then((jwt) => {
                assert.isNotNull(jwt)
                return crypt.verifyJWT({
                    jwt,
                    audience: AUDIENCE,
                })
            }).then((decoded) => {
                assert.equal(decoded.uid, CLAIM.uid)
                assert.equal(decoded.aud, AUDIENCE)
                done()
            })
        })
    })

    describe("genSalt", () => {
        it("generates salt", (done) => {
            const ROUNDS = 5

            crypt.genSalt(ROUNDS)
                .then((salt) => {
                    assert.isNotNull(salt)
                    done()
                })
        })

        it("throws error with invalid round", () => {
            const ROUNDS = "INVALID ROUND"

            return crypt.genSalt(ROUNDS).should.be.rejected
        })
    })

    describe("hash", () => {
        it("generates salted hash", (done) => {
            const VALUE = "password"
            const SALT = "$2a$05$B7t7mYNm9ZOIY.2SnaJF0."

            crypt.hash(VALUE, SALT)
                .then((hash) => {
                    assert.isNotNull(hash)
                    done()
                })
        })

        it("throws error with invalid value", () => {
            const VALUE = -1
            const SALT = "$2a$05$B7t7mYNm9ZOIY.2SnaJF0."

            return crypt.hash(VALUE, SALT).should.be.rejected
        })

        it("throws error with invalid salt", () => {
            const VALUE = "password"
            const SALT = "INVALID SALT"

            return crypt.hash(VALUE, SALT).should.be.rejected
        })
    })

    describe("compare", () => {
        it("returns true when values match", (done) => {
            const VALUE = "password"
            const SALT = "$2a$05$B7t7mYNm9ZOIY.2SnaJF0."

            crypt.hash(VALUE, SALT)
                .then((hash) => crypt.compare(VALUE, hash))
                .then((match) => {
                    assert.isTrue(match)
                    done()
                })
        })

        it("returns false when values do not match", (done) => {
            const VALUE = "password"
            const WRONG_VALUE = "WRONG VALUE"
            const SALT = "$2a$05$B7t7mYNm9ZOIY.2SnaJF0."

            crypt.hash(VALUE, SALT)
                .then((hash) => crypt.compare(WRONG_VALUE, hash))
                .then((match) => {
                    assert.isFalse(match)
                    done()
                })
        })
    })

    describe("randomBytes", () => {
        it("generates pseudorandom bytes with correct size", (done) => {
            const SIZE = 256

            crypt.randomBytes(SIZE)
                .then((value) => {
                    const size = Buffer.byteLength(value, "hex")
                    assert.equal(size, SIZE)
                    done()
                })
        })

        it("throws error with invalid size", () => {
            const SIZE = -1

            return crypt.randomBytes(SIZE).should.be.rejected
        })
    })

    describe("randomNumber", () => {
        it("generates pseudorandom number with the correct length", (done) => {
            const LENGTH = 5

            crypt.randomNumber(LENGTH)
                .then((value) => {
                    assert.lengthOf(value.toString(), LENGTH)
                    done()
                })
        })

        it("throws error with invalid length", () => {
            const LENGTH = -1

            return crypt.randomNumber(LENGTH).should.be.rejected
        })
    })
})
