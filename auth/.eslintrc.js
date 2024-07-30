module.exports = {
	parser: '@typescript-eslint/parser',
	extends: ['airbnb-typescript-prettier', 'prettier'],
	plugins: ['import', 'prettier', '@typescript-eslint'],
	parserOptions: { project: './tsconfig.json', tsconfigRootDir: __dirname },
	rules: {
		quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'import/prefer-default-export': 'off',
	},
	settings: {
		react: {
			version: '999.999.999', // Invalid version to prevent detection attempts
		},
	},
};
