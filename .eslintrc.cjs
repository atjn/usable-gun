module.exports = {
	root: true,
	extends: [
		"@atjn/eslint-config",
	],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: "latest",
	},
	rules: {
		"no-console": "off",

		"jsdoc/require-description": "off",
		"jsdoc/require-file-overview": "off",
	},
};
