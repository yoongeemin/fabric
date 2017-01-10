import React from "react"
import { connect } from "react-redux"
import { signOutRequest, getUser } from "app/redux/actions"

class Test extends React.Component {
    componentDidMount() {
        this.props.getUser()
    }

    render() {
        return (
            <div>
                <div>authenticated: {this.props.authenticated}</div>
                <a href="javascript:void(0)" onClick={() => this.props.signOutRequest()}>Sign Out</a>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    authenticated: state.get("auth").get("authenticated"),
})

export default connect(
    mapStateToProps,
    { signOutRequest, getUser }
)(Test)
