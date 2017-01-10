const srcContext = require.context(
    "../../src/server",
    true,
    /^((?!routes|index|[\\/]instances[\\/]).)*\.js$/
)
srcContext.keys().forEach(srcContext)

const context = require.context("./", true, /\.test.js$/)
context.keys().forEach(context)
