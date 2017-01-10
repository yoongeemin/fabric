import _ from "lodash"
import React  from "react"
import { View, Navigator } from "react-native"
import RouteConfig from "app/native/lib/routes.json"
import * as Components from "app/native/components"
import * as Containers from "app/native/containers"

const Root = () =>
    <Navigator initialRoute={{ id: RouteConfig.routes[0].id }}
               renderScene={(route, navigator) => {
                   const match = _.find(RouteConfig.routes, { id: route.id })
                   const Reducer = Containers.Reducer
                   const Component = match.connected ? Containers[match.component] : Components[match.component]

                   return (
                       <View>
                           <Reducer navigator={navigator} />
                           <Component {...route.passProps} />
                       </View>
                   )
               }} />

export default Root
