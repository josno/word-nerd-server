const express = require('express');
const path = require('path');
const GamesService = require('../games/games-service');
const { requireAuth } = require('../middleware/jwt-auth');
const gamesRouter = express.Router();
const jsonBodyParser = express.json();

gamesRouter
	.route('/')
	.all(requireAuth)
	.get((req, res, next) => {
		GamesService.getGamesByUserId(
			res.app.get('db'),
			req.user.id
		).then(response => res.status(200).json(response));
	})
	.post(jsonBodyParser, (req, res, next) => {
		const { title, word_list, date_created } = req.body;

		const newGame = {
			title,
			word_list,
			date_created,
			/*Using req.user.id from auth include in newGame object*/
			user_id: req.user.id
		};

		for (const [key, value] of Object.entries(newGame))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});

		const invalidWordList = word_list
			.toString()
			.match(/[0-9\[\^\$\.\|\?\*\+\(\)\{\}]/g);

		if (invalidWordList) {
			return res.status(400).json({
				error: `Cannot contain numbers or special characters.`
			});
		}

		GamesService.insertNewGame(req.app.get('db'), newGame)
			.then(game => {
				res.status(201)
					.location(path.posix.join(req.originalUrl, `/${game.id}`))
					.json(GamesService.serializeGame(game));
			})
			.catch(next);
	});

gamesRouter
	.route('/:game_id')
	.all(requireAuth)
	.get((req, res, next) => {
		GamesService.getGameByGameId(res.app.get('db'), req.params.game_id)

			.then(game => {
				if (!game) {
					return res.status(404).json({ error: `Can't find game.` });
				}
				res.status(200).json(GamesService.serializeGame(game));
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		GamesService.getGameByGameId(
			//check if game exists
			res.app.get('db'),
			req.params.game_id
		)
			.then(game => {
				//if there is no game || game user id in db is not the user id in the request body
				if (!game || game.user_id != req.user.id) {
					return res.status(404).json({
						error: `Can't find game.`
					});
				}

				GamesService.deleteByGameId(
					res.app.get('db'),
					req.params.game_id
				).then(affectedGames => res.status(204).end());
			})
			.catch(next);
	})
	.patch(jsonBodyParser, (req, res, next) => {
		const { title, word_list } = req.body;

		const gameToUpdate = {
			title: title,
			word_list: word_list,
			user_id: req.user.id,
			id: req.params.game_id
			/*Must pass the validated user with token check*/
		};

		for (const [key, value] of Object.entries(gameToUpdate))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				});

		const invalidWordList = word_list
			.toString()
			.match(/[0-9\[\^\$\.\|\?\*\+\(\)\{\}]/g);

		if (invalidWordList) {
			return res.status(400).json({
				error: `Cannot contain numbers or special characters.`
			});
		}

		GamesService.getGameByGameId(res.app.get('db'), req.params.game_id)
			.then(game => {
				if (!game || game.user_id != req.user.id) {
					return res.status(400).json({
						error: `Can't find game.`
					});
				}

				GamesService.updateGameById(
					req.app.get('db'),
					req.params.game_id,
					gameToUpdate
				).then(rowsAffected => {
					if (!rowsAffected) {
						res.status(400).json({ error: `Can't find game.` });
					}
					res.status(204).end();
				});
			})
			.catch(next);
	});

module.exports = gamesRouter;
