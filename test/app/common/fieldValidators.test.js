import { assert } from "chai"
import * as validators from "app/common/fieldValidators"

describe("fieldValidators", () => {
    describe("email", () => {
        it("passes with valid email address", () => {
            const EMAIL = "test@test.com"
            assert.isTrue(validators.email.validate(EMAIL))
        })

        it("fails with invalid email address", () => {
            const EMAIL = "INVALID_EMAIL"
            assert.isFalse(validators.email.validate(EMAIL))
        })
    })
})
