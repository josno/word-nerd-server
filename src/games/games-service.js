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
	updateGameById(db, id, newInfo) {
		return db
			.from('games')
			.where('id', id)
			.update(newInfo);
	},
	serializeGame(game) {
		const serializedList = xss([game.word_list]);
		const formattedArray = serializedList.split(',');
		return {
			id: game.id,
			user_id: game.user_id,
			word_list: formattedArray,
			title: xss(game.title),
			date_created: game.date_created
		};
	}
};

module.exports = GamesService;
