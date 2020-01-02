function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'nerd',
			full_name: 'Word Nerd',
			password: 'nerdpass'
		},
		{
			id: 2,
			user_name: 'dunder',
			full_name: 'Dunder Mifflin',
			password: 'dunderpass'
		}
	];
}

function makeGamesArray(users) {
	return [
		{
			id: 1,
			title: 'Colors',
			word_list: [
				'red',
				'blue',
				'pink',
				'orange',
				'green',
				'purple',
				'mint',
				'black',
				'white'
			],
			user_id: 1
		},
		{
			id: 2,
			title: 'Animals',
			word_list: [
				'bird',
				'turtle',
				'horse',
				'fish',
				'alligator',
				'cheetah',
				'lion',
				'tiger',
				'bear'
			],
			user_id: 1
		},
		{
			id: 3,
			title: 'Places',
			word_list: [
				'library',
				'school',
				'park',
				'restaurant',
				'museum',
				'cafe',
				'bakery',
				'store',
				'market',
				'hospital'
			],
			user_id: 2
		}
	];
}

function seedTestTables(db, users, games) {
	// return db
	// 	.into('users')
	// 	.insert(users)
	// 	.then(() => db.into('words').insert(games));

	// use a transaction to group the queries and auto rollback on any failure
	return db.transaction(async trx => {
		await trx.into('users').insert(users);
		await trx.into('words').insert(games);
		// update the auto sequence to match the forced id values
		await Promise.all([
			trx.raw(`SELECT setval('users_id_seq', ?)`, [
				users[users.length - 1].id
			]),
			trx.raw(`SELECT setval('words_id_seq', ?)`, [
				games[games.length - 1].id
			])
		]);
		// only insert comments if there are some, also update the sequence counter
	});
}

function cleanTables(db) {
	return db.transaction(trx =>
		trx
			.raw(
				`TRUNCATE
		  users,
		  words
		`
			)
			.then(() =>
				Promise.all([
					trx.raw(
						`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`
					),
					trx.raw(
						`ALTER SEQUENCE words_id_seq minvalue 0 START WITH 1`
					),
					trx.raw(`SELECT setval('users_id_seq', 0)`),
					trx.raw(`SELECT setval('words_id_seq', 0)`)
				])
			)
	);
}

function makeGamesFixtures() {
	const testUsers = makeUsersArray();
	const testGames = makeGamesArray(testUsers); //should pass testUsers from above
	return { testUsers, testGames };
}

module.exports = {
	makeGamesFixtures,
	makeUsersArray,
	makeGamesArray,
	seedTestTables,
	cleanTables
};
