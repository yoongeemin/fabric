import React from "react"
import { expect } from "chai"
import { shallow } from "enzyme"
import NotFound from "app/web/components/NotFound"

describe("<NotFound />", () => {
    it("renders", () => {
        const wrapper = shallow(<NotFound />)
    })
})
