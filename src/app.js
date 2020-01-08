require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { requireAuth } = require('./middleware/basic-auth');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const gamesRouter = require('./games/games-router');
const authRouter = require('./auth/auth-router');
const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

app.use('/api/v1/games', gamesRouter);
app.use('/api/auth', authRouter);

app.use(function errorHandler(error, req, res, next) {
	let response;
	if (NODE_ENV === 'production') {
		response = { error: { message: 'server error' } };
	} else {
		console.error(error);
		response = { message: error.message, error };
	}
	res.status(500).json(response);
});

module.exports = app;
