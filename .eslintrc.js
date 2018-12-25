const path = require('path');

module.exports = {

    "env": {
        "browser": true,
        "es6": true
    },

    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:import/errors",
        "plugin:import/warnings"
    ],

    "parser": "babel-eslint",

    "plugins": [
        "react"
    ],

    "settings": {
        "react": {
            "version": "16.2"
        },
        "import/resolver": {
            "webpack": {
                "config": path.join(__dirname, "./webpack.dev.js"),
            }
        }
    },

    "rules": {
        "indent": [
            "error",
            4,
            { "SwitchCase": 1 }
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],

        "import/no-unresolved": "error",
        "no-async-promise-executor": "error",
        "no-template-curly-in-string": "error",
        "require-atomic-updates": "error",
        "valid-jsdoc": "error",
        "array-callback-return": "error",
        "class-methods-use-this": [
            "error",
            {
                "exceptMethods": [
                    "render",
                    "getInitialState",
                    "getDefaultProps",
                    "getChildContext",
                    "componentWillMount",
                    "componentDidMount",
                    "componentWillReceiveProps",
                    "shouldComponentUpdate",
                    "componentWillUpdate",
                    "componentDidUpdate",
                    "componentWillUnmount",
                ]
            }
        ],
        "no-caller": "error",
        "curly": "error",
        "dot-location": [
            "error",
            "property"
        ],
        "dot-notation": [
            "error",
            { "allowKeywords": true }
        ],
        "eqeqeq": "error",
        "no-else-return": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-floating-decimal": "error",
        "no-implied-eval": "error",
        "no-labels": "error",
        "no-lone-blocks": "error",
        "no-multi-spaces": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-param-reassign": "error",
        "no-proto": "error",
        "no-return-assign": "error",
        "no-return-await": "error",
        "no-sequences": "error",
        "no-throw-literal": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": [
            "error",
            { "allowShortCircuit": true, "allowTernary": true }
        ],
        "no-useless-call": "error",
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "no-with": "error",
        "prefer-promise-reject-errors": "error",
        "radix": "error",
        "require-await": "error",
        "wrap-iife": "error",
        "yoda": "error",
        "no-shadow-restricted-names": "error",
        "no-undef-init": "error",
        "no-use-before-define": "error",
        "global-require": "error",
        "handle-callback-err": "error",
        "no-buffer-constructor": "error",
        "no-new-require": "error",
        "no-path-concat": "error",
        "block-spacing": "error",
        "camelcase": ["error", { "properties": "never" }],
        "comma-dangle": [
            "error",
            {
                "arrays": "never",
                "objects": "never",
                "imports": "never",
                "exports": "never",
                "functions": "never"
            }
        ],
        "comma-spacing": "error",
        "comma-style": "error",
        "computed-property-spacing": "error",
        "func-call-spacing": "error",
        "key-spacing": [
            "error",
            { "beforeColon": false, "afterColon": true }
        ],
        "lines-between-class-members": "error",
        "max-len": [
            "error",
            { "code": 100 }
        ],
        "max-nested-callbacks": ["error", 3],
        "max-params": ["error", 4],
        "new-cap": [
            "error",
            { "capIsNew": false }
        ],
        "new-parens": "error",
        "no-array-constructor": "error",
        "no-lonely-if": "error",
        "no-multi-assign": "error",
        "no-multiple-empty-lines": "error",
        "no-nested-ternary": "error",
        "no-new-object": "error",
        "no-trailing-spaces": "error",
        "no-unneeded-ternary": "error",
        "no-whitespace-before-property": "error",
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "one-var": [
            "error",
            "never"
        ],
        "one-var-declaration-per-line": "error",
        "operator-linebreak": [
            "error",
            "after"
        ],
        "quote-props": [
            "error",
            "as-needed"
        ],
        "semi-spacing": [
            "error",
            { "before": false, "after": true }
        ],
        "semi-style": "error",
        "space-before-blocks": "error",
        "space-before-function-paren": [
            "error",
            {
                "anonymous": "always",
                "named": "never",
                "asyncArrow": "always"
            }
        ],
        "space-in-parens": ["error", "never"],
        "spaced-comment": ["error", "always"],
        "switch-colon-spacing": [
            "error",
            { "after": true, "before": false }
        ],
        "template-tag-spacing": ["error", "never"],
        "arrow-parens": [
            "error",
            "as-needed",
            { "requireForBlockBody": true }
        ],
        "arrow-spacing": "error",
        "generator-star-spacing": [
            "error",
            { "before": true, "after": false }
        ],
        "no-duplicate-imports": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-arrow-callback": "error",
        "prefer-const": "error",
        "prefer-destructuring": [
            "error",
            { "array": false, "object": true },
            { "enforceForRenamedProperties": false }
        ],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "template-curly-spacing": "error",
        "no-unused-vars": "error",
        "import/no-named-as-default-member": "off",
        "import/no-named-as-default": "off",

        "react/default-props-match-prop-types": "error",
        "react/no-access-state-in-setstate": "error",
        "react/no-danger": "error",
        "react/no-did-mount-set-state": "error",
        "react/no-did-update-set-state": "error",
        "react/no-multi-comp": "error",
        "react/no-redundant-should-component-update": "error",
        "react/no-this-in-sfc": "error",
        "react/no-will-update-set-state": "error",
        "react/prefer-es6-class": "error",
        "react/require-default-props": "error",
        "react/style-prop-object": "error",
        "react/void-dom-elements-no-children": "error",
        "react/jsx-boolean-value": ["error", "never"],
        "react/jsx-closing-bracket-location": "error",
        "react/jsx-closing-tag-location": "error",
        "react/jsx-curly-spacing": ["error", { "when": "never" }],
        "react/jsx-equals-spacing": ["error", "never"],
        "react/jsx-filename-extension": "error",
        "react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
        "react/jsx-no-bind": ["error", { "ignoreRefs": true }],
        "react/jsx-pascal-case": "error",
        "react/jsx-props-no-multi-spaces": "error",
        "react/jsx-tag-spacing": [
            "error",
            {
                "closingSlash": "never",
                "beforeSelfClosing": "always",
                "afterOpening": "never",
                "beforeClosing": "allow"
            }
        ]
    }
};