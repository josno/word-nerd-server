const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
	const token = jwt.sign({ user_id: user.id }, secret, {
		subject: user.user_name,
		algorithm: 'HS256'
	});

	return `Bearer ${token}`;
}

function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'nerd',
			full_name: 'Word Nerd',
			password: 'nerdpass',
			date_created: '2020-01-22T18:16:54.653Z'
		},
		{
			id: 2,
			user_name: 'dunder',
			full_name: 'Dunder Mifflin',
			password: 'dunderpass',
			date_created: '2020-01-22T18:16:54.653Z'
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
			user_id: 1,
			date_created: '2020-01-22T18:16:54.653Z'
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
			user_id: 1,
			date_created: '2020-01-22T18:16:54.653Z'
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
			user_id: 2,
			date_created: '2020-01-22T18:16:54.653Z'
		}
	];
}

function makeMaliciousGameArray(users) {
	return [
		{
			id: 1,
			title: '<script>Colors</script>',
			word_list: [
				'<script>red</script>',
				'blue',
				'pink',
				'orange',
				'<script>green</script>',
				'purple',
				'mint',
				'black',
				'white'
			],
			user_id: 1,
			date_created: '2020-01-22T18:16:54.653Z'
		}
	];
}

function seedGamesTables(db, users, games) {
	return db.transaction(async trx => {
		await seedUsers(trx, users);
		await trx.into('games').insert(games);

		await trx.raw(`SELECT setval('games_id_seq', ?)`, [
			games[games.length - 1].id
		]);
	});
}

function seedUsers(db, users) {
	const preppedUsers = users.map(user => ({
		...user,
		password: bcrypt.hashSync(user.password, 1)
	}));
	return db
		.into('users')
		.insert(preppedUsers)
		.then(() =>
			db.raw(`SELECT setval('users_id_seq', ?)`, [
				users[users.length - 1].id
			])
		);
}

function cleanTables(db) {
	return db.transaction(trx =>
		trx
			.raw(
				`TRUNCATE
		  users,
		  games
		`
			)
			.then(() =>
				Promise.all([
					trx.raw(
						`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`
					),
					trx.raw(
						`ALTER SEQUENCE games_id_seq minvalue 0 START WITH 1`
					),
					trx.raw(`SELECT setval('users_id_seq', 0)`),
					trx.raw(`SELECT setval('games_id_seq', 0)`)
				])
			)
	);
}

function makeNewGame() {
	return {
		title: 'Weather',
		word_list: ['rainy', 'snowy', 'sunny', 'windy', 'cloudy'],
		date_created: '2020-01-22T18:16:54.653Z'
	};
}

function makeMaliciousGamesFixtures() {
	const testUsers = makeUsersArray();
	const testGames = makeMaliciousGamesArray(testUsers); //should pass testUsers from above
	return { testUsers, testGames };
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
	seedGamesTables,
	cleanTables,
	makeAuthHeader,
	seedUsers,
	makeNewGame,
	makeMaliciousGamesFixtures,
	makeMaliciousGameArray
};
