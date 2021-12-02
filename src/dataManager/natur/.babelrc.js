module.exports = {
	plugins: [
		"@babel/plugin-syntax-dynamic-import",
		"@babel/plugin-proposal-export-default-from",
		process.env.NODE_ENV === "test" && "@babel/plugin-transform-modules-commonjs",
		process.env.NODE_ENV === "test" && "@babel/plugin-transform-runtime",
		["@babel/plugin-proposal-class-properties", { loose: true }],
	].filter(Boolean),
	presets: [
		[
			"@babel/preset-env",
			{
				modules: false,
				loose: true,
			},
		],
		["@babel/preset-react"],
		["@babel/preset-typescript"],
	],
};
