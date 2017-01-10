const srcContext = require.context(
    "../../src/app",
    true,
    // /^((?!index|[\\/]native[\\/]).)*\.js$/
    /^((?!index).)*\.js$/
)
srcContext.keys().forEach(srcContext)

const context = require.context("./", true, /\.test.js$/)
context.keys().forEach(context)
