import React from "react"
import { connect } from "react-redux"
import { Reducer } from "app/web/containers"

class App extends React.Component {
    static propTypes = {
        children: React.PropTypes.object,
    }

    shouldComponentUpdate(nextProps) {
        return true
    }

    render() {
        return (
            <div>
                <Reducer />
                NO HEADER YET
                {this.props.children}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    scene: state.get("app").get("scene"),
})

export default connect(
    mapStateToProps,
    null
)(App)
