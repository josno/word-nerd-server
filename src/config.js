module.exports = {
	PORT: process.env.PORT || 8000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	DB_URL:
		process.env.DB_URL ||
		'postgres://word_nerd_user@localhost:5432/word_nerd',
	JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
	CLIENT_ORIGIN: 'https://word-nerd.now.sh'
};
