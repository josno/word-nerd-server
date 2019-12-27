require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { requireAuth } = require('./middleware/basic-auth');
const GamesService = require('./games-service');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const gamesRouter = require('./games/games-router');
const app = express();

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
	res.send('Hello, world!');
});

// app.all(requireAuth)
// 	.get('/api/v1/games', (req, res, next) => {
// 		GamesService.getGames(res.app.get('db')).then(response =>
// 			res.json(response)
// 		);
// 	})
// 	.post('api/v1/games', (req, res, next) => {
// 		/*When user submits a new game:
// 	   1. on Submit - POST new game
// 	   2. get game ID
// 	   3. generate new state
// 	   4. grab the list of words from game Id
// 	   5. generate the first word from that list
// 	*/
// 	});

app.use('/api/v1/games', gamesRouter);

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
