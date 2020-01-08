const GamesService = {
	getGames(db) {
		return db.from('games').select('*');
	},
	getGameByGameId(db, id) {
		return db
			.from('games')
			.select('user_id', 'word_list')
			.where('id', id)
			.first();
	},
	getGameByUserId(db, userid) {
		return db
			.from('games')
			.select('*')
			.where('user_id', userid);
	},
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
