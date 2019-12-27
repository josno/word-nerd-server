const GamesService = {
	getGames(db) {
		return db.from('words').select('*');
	},
	getGameByGameId(db, id) {
		return db
			.from('words')
			.select('*')
			.where('id', id)
			.first();
	},
	getGameByUserId(db, userid) {
		return db
			.from('words')
			.select('*')
			.where('user_id', userid)
			.first();
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
			.insert(newNote)
			.into('words')
			.returning('*')
			.then(array => array[0]);
	}
};

module.exports = GamesService;
