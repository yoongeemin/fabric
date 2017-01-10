import React  from "react"
import { View, Text } from "react-native"
import { connect } from "react-redux"
import Styles from "app/native/styles/authentication"
import { Button } from "app/native/components"
import { signOutRequest } from "app/redux/actions"

const App = (props) => (
    <View>
        <Text>APP</Text>

        <Button style={[Styles.bgRed]}
                text="Sign Out"
                onPress={props.signOutRequest} />
    </View>
)

App.propTypes = {
    signOutRequest: React.PropTypes.func.isRequired,
}

export default connect(
    null,
    { signOutRequest }
)(App)
