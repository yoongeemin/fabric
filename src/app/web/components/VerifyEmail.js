import React from "react"
import { POST } from "app/common/http"
import { VERIFY_EMAIL_API } from "app/common/constants"


export default class VerifyEmail extends React.Component {
    constructor(props) {
        super(props)
        this.state = { loading: true, verified: false }
    }

    componentDidMount() {
        const self = this
        const { jwt } = this.props.params
        POST(VERIFY_EMAIL_API, { jwt })
            .then(() => self.setState({ loading: false, verified: true }))
            .catch(() => self.setState({ loading: false, verified: false }))
    }

    render() {
        const { loading, verified } = this.state
        return (
            <div>
                { loading
                    ? <div>Loading</div>
                    : verified
                        ? <div>Verified</div>
                        : <div>Fail</div>
                }
            </div>
        )
    }
}
