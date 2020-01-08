const express = require('express');
const path = require('path');
const GamesService = require('../games/games-service');
// const { requireAuth } = require('../middleware/basic-auth');
const { requireAuth } = require('../middleware/jwt-auth');

const gamesRouter = express.Router();
const jsonBodyParser = express.json();

gamesRouter
	.route('/')
	.all(requireAuth)
	.get((req, res, next) => {
		GamesService.getGameByUserId(
			res.app.get('db'),
			req.user.id
		).then(response => res.status(200).json(response));
	})
	.post(requireAuth, jsonBodyParser, (req, res, next) => {
		const { title, word_list, date_created, user_id } = req.body;

		//create new game object using the information from the request body
		const newGame = { title, word_list, date_created, user_id };

		//checks that all required keys exist
		for (const [key, value] of Object.entries(newGame))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});

		GamesService.insertNewGame(req.app.get('db'), newGame)
			.then(game => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `/${game.id}`))
					.json(game);
			})
			.catch(next);
	});

gamesRouter
	.route('/:game_id')
	.all(requireAuth)
	.get((req, res, next) => {
		GamesService.getGameByGameId(
			res.app.get('db'),
			req.params.game_id
		).then(response => res.status(200).json(response));
	})
	.delete((req, res, next) => {
		GamesService.getGameByGameId(
			res.app.get('db'),
			req.params.game_id
		).then(game => {
			console.log(req.user.id, req.user, game);
			if (req.user.id != game.user_id) {
				return res.status(404).json({
					error: `Can't find game.`
				});
			}
			GamesService.deleteById(res.app.get('db'), req.params.game_id)
				.then(numRowsAffected => {
					res.status(204).end();
				})
				.catch(next);
		});

		// GamesService.deleteById(res.app.get('db'), req.params.game_id)
		// 	.then(numRowsAffected => {
		// 		res.status(204).end();
		// 	})
		// 	.catch(next);
	});

module.exports = gamesRouter;
