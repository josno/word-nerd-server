function makeUsersArray() {
	return [
		{
			id: 1,
			user_name: 'nerd',
			full_name: 'Word Nerd',
			password: 'nerdpass'
		},
		{
			id: 1,
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

function makeGamesFixtures() {
	const testUsers = makeUsersArray();
	const testGames = makeGamesArray();
	return { testUsers, testGames };
}

module.exports = {
	makeGamesFixtures,
	makeUsersArray,
	makeGamesArray
};
