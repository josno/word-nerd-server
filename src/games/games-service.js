const xss = require('xss');

const GamesService = {
	getGameByGameId(db, id) {
		return db
			.from('games')
			.select('*')
			.where('id', id)
			.first();
	},
	getGamesByUserId(db, userId) {
		return db
			.from('games')
			.select('*')
			.where('user_id', userId);
	},
	getGameByUsername(db, username) {
		return db
			.from('games')
			.select('*')
			.where('user_name', username)
			.first();
	},
	deleteByGameId(db, id) {
		return db
			.from('games')
			.where({ id })
			.delete();
	},
	insertNewGame(db, newGame) {
		return db
			.insert(newGame)
			.into('games')
			.returning('*')
			.then(gamearray => gamearray[0]);
	},
	// updateGameById(db, id, newInfo) {
	// 	return db
	// 		.from('games')
	// 		.where('id', id)
	// 		.update(newInfo);
	// },
	serializeGame(game) {
		return {
			id: game.user_id,
			title: xss(game.title),
			word_list: xss(game.word_list),
			date_created: new Date(game.date_created)
		};
	}
};

module.exports = GamesService;
