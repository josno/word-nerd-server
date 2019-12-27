const GamesService = {
	getGames(db) {
		return db.from('words').select('*');
	},
	getGameByGameId(db, id) {
		return db
			.from('words')
			.select('word_list')
			.where('id', id)
			.first();
	},
	getGameByUserId(db, userid) {
		return db
			.from('words')
			.select('*')
			.where('user_id', userid);
	},
	getGameByUsername(db, username) {
		return db
			.from('words')
			.select('*')
			.where('user_name', username)
			.first();
	},
	deleteById(db, id) {
		return db
			.from('words')
			.where({ id })
			.delete();
	},
	updateGameById(db, id, newInfo) {
		return db
			.from('words')
			.where('id', id)
			.update(newInfo);
	},
	insertNewGame(db, newGame) {
		return db
			.insert(newGame)
			.into('words')
			.returning('*')
			.then(gamearray => gamearray[0]);
	}
};

module.exports = GamesService;
