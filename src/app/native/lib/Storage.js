import { AsyncStorage } from "react-native"

const Storage = {
    get(key) {
        return AsyncStorage.getItem(key).then((item) => (
            (Date.now() >= item.expire)
                ? this.delete(key).then(() => null)
                : item.value
        ))
    },

    set(key, value, expiresIn = (1 * 24 * 60 * 60 * 1000)) {
        return AsyncStorage.setItem(
            key,
            JSON.stringify({
                value,
                expire: Date.now() + expiresIn,
            })
        )
    },

    delete(key) {
        return AsyncStorage.removeItem(key)
    },

    clear() {
        return AsyncStorage.clear()
    },

    keys() {
        return AsyncStorage.getAllKeys()
    },
}

export default Storage
