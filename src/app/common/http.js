/**
 * HTTP library using Axios
 */

import { get as httpGet, post as httpPost } from "axios"

/**
 * HTTP GET request
 * @param {String} url
 * @param {Object} params
 * @returns {Promise} Request
 */
export const GET = (url, params = {}) => {
    const headers = { "Content-Type": "application/json" }
    return httpGet(url, JSON.stringify(params), {
        headers,
        withCredentials: true,
    })
}

/**
 * HTTP POST request
 * @param {String} url
 * @param {Object} params
 * @param {Boolean} csrf - Use CSRF token
 * @returns {Promise} Request
 */
export const POST = (url, params = {}, csrf = false) => {
    const headers = { "Content-Type": "application/json" }

    /* eslint-disable no-undef */
    if (csrf) headers["x-csrf-token"] = document.querySelector("meta[name='csrf']").getAttribute("content")
    /* eslint-disable no-undef */

    return httpPost(url, JSON.stringify(params), {
        headers,
        withCredentials: true,
    })
}
