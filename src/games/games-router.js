const express = require('express');
const GamesService = require('./games-service');
const { requireAuth } = require('../middleware/basic-auth');
// const { requireAuth } = require('../middleware/jwt-auth');

const gamesRouter = express.Router();

// gamesRouter
// 	.route('/')
// 	.all(requireAuth)
// 	.get((req, res, next) => {
// 		GamesService.getGameByUserId(
// 			res.app.get('db'),
// 			req.params.user.id
// 		).then(response => res.json(response));
// 	});
// .post('api/v1/games', (req, res, next) => {});

gamesRouter
	.route('/')
	.all(requireAuth)
	.get((req, res, next) => {
		GamesService.getGamesByUserId(res.app.get('db')).then(response =>
			res.status(200).json(response)
		);
	});
// .post('api/v1/games', (req, res, next) => {
// 	/*When user submits a new game:
//    1. on Submit - POST new game
//    2. get game ID
//    3. generate new state
//    4. grab the list of words from game Id
//    5. generate the first word from that list
// */
// });

module.exports = gamesRouter;
