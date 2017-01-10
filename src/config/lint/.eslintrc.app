{
	"extends": [
	    "./.eslintrc.common",
	    "plugin:react/recommended"
	],

    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },

    "plugins": [
        "react"
    ],

    "rules": {
        "react/display-name": 0,
        "react/forbid-prop-types": 0,
        "react/jsx-closing-bracket-location": 0,
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "react/jsx-first-prop-new-line": 0,
        "react/jsx-indent": [1, 4],
        "react/jsx-indent-props": 0,
        "react/jsx-space-before-closing": 1,
        "react/no-multi-comp": 0,
        "react/no-unused-prop-types": 1,
        "react/prefer-stateless-function": 1,
        "react/prop-types": 1,
    },
}