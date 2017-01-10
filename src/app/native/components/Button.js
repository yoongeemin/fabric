import React  from "react"
import { View, TouchableHighlight, Text } from "react-native"

const Button = (props) => (
    <TouchableHighlight style={props.style}
                        onPress={props.onPress}>
        <Text>{props.text}</Text>
    </TouchableHighlight>
)

Button.propTypes = {
    style: React.PropTypes.array.isRequired,
    text: React.PropTypes.string.isRequired,
    onPress: React.PropTypes.func.isRequired,
}

export default Button
