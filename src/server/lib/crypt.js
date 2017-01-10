/**
 * Crypto library
 */

import {
    compare as bcompare,
    genSalt as bgenSalt,
    hash as bhash,
} from "bcrypt"
import crypto from "crypto"
import Bluebird from "bluebird"
import { sign, verify } from "jsonwebtoken"

/**
 * Asynchronously generate JSON web token
 * @param {Object} claim
 * @param {String} audience
 * @param {String} expiresIn
 * @returns {Promise} JSON web token
 */
export const genJWT = ({
    claim,
    audience,
    expiresIn,
}) => new Bluebird((resolve, reject) => {
    sign(
        claim,
        process.env.JWT_SECRET,
        {
            audience,
            expiresIn,
            issuer: `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
            algorithm: process.env.JWT_ALGO,
        },
        (err, token) => {
            if (err) return reject(err)
            return resolve(token)
        }
    )
})

/**
 * Asynchronously verify JSON web token
 * @param {String} jwt
 * @param {String} audience
 * @returns {Promise} Decoded JWT
 */
export const verifyJWT = ({
    jwt,
    audience,
}) => new Bluebird((resolve, reject) => {
    verify(
        jwt,
        process.env.JWT_SECRET,
        {
            audience,
            issuer: `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`,
            algorithm: process.env.JWT_ALGO,
        },
        (err, decoded) => {
            if (err) return reject(err)
            return resolve(decoded)
        }
    )
})

/**
 * Asynchronously generate salt
 * @param {Number} rounds - Rounds of Blowfish keying algorithm
 * @returns {Promise} Salt
 */
export const genSalt = (rounds) =>
    new Bluebird((resolve, reject) => {
        bgenSalt(rounds, (err, salt) => {
            if (err) return reject(err)
            return resolve(salt)
        })
    })

/**
 * Asynchronously hashes given value
 * @param {String} value
 * @param {String} salt
 * @returns {Promise} Hashed result
 */
export const hash = (value, salt) =>
    new Bluebird((resolve, reject) => {
        bhash(value, salt, (err, hasedValue) => {
            if (err) return reject(err)
            return resolve(hasedValue)
        })
    })

/**
 * Asynchronously compare value with hash
 * @param {String} value
 * @param {String} hashedValue
 * @returns {Promise} Match
 */
export const compare = (value, hashedValue) =>
    new Bluebird((resolve, reject) => {
        bcompare(value, hashedValue, (err, match) => {
            if (err) return reject(err)
            return resolve(match)
        })
    })

/**
 * Asynchronously generates pseudorandom bytes
 * @param {Number} size - Byte size
 * @returns {Promise} Pseudorandom bytes
 */
export const randomBytes = (size) =>
    new Bluebird((resolve, reject) => {
        crypto.randomBytes(size, (err, buff) => {
            if (err) return reject(err)
            return resolve(buff.toString("hex"))
        })
    })

/**
 * Asynchronously generates pseudorandom number
 * @param {Number} length - Number length
 * @returns {Promise} Pseudorandom number
 */
export const randomNumber = (length) =>
    new Bluebird((resolve, reject) => {
        crypto.randomBytes(length, (err, buff) => {
            if (err) return reject(err)
            const hex = buff.toString("hex")
            const int = parseInt(hex, 16)
            const min = 10 ** (length - 1)
            const max = 10 ** length
            const factor = (max - min) / (2 ** (length * 8))
            const random = (int * factor + min) >> 0
            return resolve(random)
        })
    })
