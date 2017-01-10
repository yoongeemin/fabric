import _ from "lodash"
import { StyleSheet } from "react-native"

const textInput = {
    height: 40,
    borderWidth: 1,
    borderColor: "black",
}

export default StyleSheet.create({
    textInput,

    textInputError: _.assign(_.clone(textInput), {
        borderColor: "red",
    }),

    bgRed: {
        height: 20,
        backgroundColor: "red",
    },

    bgBlack: {
        height: 20,
        backgroundColor: "black",
    },
})
