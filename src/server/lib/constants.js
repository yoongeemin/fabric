/**
 * Server constants
 */

/**
 * Environment
 */
export const TEST = "TEST"
export const DEV  = "DEV"
export const QA   = "QA"
export const PROD = "PROD"

/**
 * Platform
 */
export const WEB     = "WEB"
export const IOS     = "IOS"
export const ANDROID = "ANDROID"

/**
 * HTTP
 */
export const OK                    = 200
export const BAD_REQUEST           = 400
export const UNAUTHORIZED          = 401
export const NOT_FOUND             = 404
export const CONFLICT              = 409
export const INTERNAL_SERVER_ERROR = 500
export const SERVICE_UNAVAILABLE   = 503

/**
 * Crypto
 */
export const JWT                         = "JWT"
export const JWT_ACTIVATE_EMAIL_TTL      = "5m"
export const JWT_RESET_PASSWORD_TTL      = "5m"
export const ACTIVATE_TOKEN_LENGTH       = 6
export const ACTIVATE_TOKEN_EXPIRE       = (5 * 60 * 1000) // 5 minutes
export const RESET_PASSWORD_TOKEN_LENGTH = 16
export const RESET_PASSWORD_TOKEN_EXPIRE = (5 * 60 * 1000) // 5 minutes
export const PASSWORD_SALT_ROUNDS        = 5

/**
 * API
 */
export const HOST = `${process.env.SERVER_PROTOCOL}://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`

/**
 * Connection state
 */
export const ALREADY_CLOSED         = "ALREADY_CLOSED"
export const FAILED                 = "FAILED"
export const RETRY_ATTEMPT_EXCEEDED = "RETRY_ATTEMPT_EXCEEDED"

/**
 * Miscellaneous
 */
