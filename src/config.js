module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DB_URL:
		process.env.DB_URL ||
		'postgres://word_nerd_user@localhost:5432/word_nerd'
};
