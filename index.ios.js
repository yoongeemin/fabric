import { AppRegistry } from "react-native"
import { NativeModules } from "react-native"

// Shim global variables
process.env = NativeModules.AppConfig
global.__NATIVE__ = true

const App = require("./src/app/native/app.ios").default
AppRegistry.registerComponent("Fabric", () => App)
