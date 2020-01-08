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
	// getSpecificGameByUserId(db, userId, gameId) {
	// 	return db
	// 		.from('games')
	// 		.select('*')
	// 		.where('user_id', userId);
	// },
	getGameByUsername(db, username) {
		return db
			.from('games')
			.select('*')
			.where('user_name', username)
			.first();
	},
	deleteById(db, id) {
		return db
			.from('games')
			.where({ id })
			.delete();
	},
	updateGameById(db, id, newInfo) {
		return db
			.from('games')
			.where('id', id)
			.update(newInfo);
	},
	insertNewGame(db, newGame) {
		return db
			.insert(newGame)
			.into('games')
			.returning('*')
			.then(gamearray => gamearray[0]);
	}
};

module.exports = GamesService;
