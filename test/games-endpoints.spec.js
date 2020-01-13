const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Games Endpoints', function() {
	let db;

	const { testUsers, testGames } = helpers.makeGamesFixtures();
	const testUser = testUsers[0];
	const testGame = testGames[0];

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => helpers.cleanTables(db));

	afterEach('cleanup', () => helpers.cleanTables(db));

	describe(`GET '/api/v1/games'`, () => {
		context('given no words or games saved', () => {
			beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
			it(`responds with 200 and empty list `, () => {
				return supertest(app)
					.get('/api/v1/games')
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(200, []);
			});
		});

		context('given there are games saved', () => {
			beforeEach('insert tables', () =>
				helpers.seedGamesTables(db, testUsers, testGames)
			);

			it(`responds with 200 and list of user's games`, () => {
				const expectedGames = testGames.filter(
					i => i.user_id === testUser.id
				);
				return supertest(app)
					.get('/api/v1/games')
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(200, expectedGames);
			});
		});
	});

	describe(`POST '/api/v1/games'`, () => {
		// context(`Given there's malicious content`, () => {
		// 	const badGame = {
		// 		title: 'naughty <script>alert("xss");</script>',
		// 		word_list: ['this', 'is', 'a', 'badscript'],
		// 		date_created: new Date()
		// 	};

		// 	const cleanGame = {
		// 		title: 'naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
		// 		word_list: ['this', 'is', 'a', 'badscript'],
		// 		date_create: new Date()
		// 	};

		// 	it(`Scrubs content and submits a clean game`, () => {
		// 		return supertest(app)
		// 			.post('/api/v1/games')
		// 			.set('Authorization', helpers.makeAuthHeader(testUser))
		// 			.send(badGame);
		// });
		// });

		context.only(`Given there is data in the games tables`, () => {
			beforeEach('insert tables', () =>
				helpers.seedGamesTables(db, testUsers, testGames)
			);

			const requiredFields = ['title', 'word_list', 'date_created'];

			requiredFields.forEach(field => {
				const loginAttemptBody = {
					title: testGame.title,
					word_list: testGame.word_list,
					date_created: testGame.date_created
				};

				it(`responds with 400 required error when '${field}' is missing`, () => {
					delete loginAttemptBody[field]; //deletes the specified field first; then test

					return supertest(app)
						.post('/api/v1/games')
						.set('Authorization', helpers.makeAuthHeader(testUser))
						.send(loginAttemptBody)
						.expect(400, {
							error: `Missing '${field}' in request body`
						});
				});
			});

			it('responds 201 with created content', () => {
				const newGame = helpers.makeNewGame();
				/*set user_id because we check against req.body user_id with the jwt token*/
				const reqUserId = testUser.id;

				return supertest(app)
					.post(`/api/v1/games`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.send(newGame)
					.expect(res => {
						expect(res.body).to.have.property('id');
						expect(reqUserId).to.deep.eql(testUser.id);
						expect(res.body.title).to.eql(newGame.title);
						expect(res.body.word_list).to.be.a('string');
						expect(res.body.word_list).to.eql(
							String(newGame.word_list)
						);
						expect(res.body.date_created).to.eql(
							newGame.date_created
						);
						// expect(res.headers.location).to.eql(
						// 	`/api/v1/games/${res.body.id}`
						// ); //does not equal
					});
			});
		});
	});

	describe(`DELETE '/api/v1/games/:gameId'`, () => {
		context('Given there are no games', () => {
			beforeEach('insert users', () => helpers.seedUsers(db, testUsers));
			it(`responds with 404 'Can't find game.' if there are no games that match the database`, () => {
				const gameId = 0;
				return supertest(app)
					.delete(`/api/v1/games/${gameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(404, { error: `Can't find game.` });
			});
		});

		context.only('Given there are games in database', () => {
			beforeEach('insert Tables', () =>
				helpers.seedGamesTables(db, testUsers, testGames)
			);

			it(`responds with '404 Can't find game' if request user doesn't match database user`, () => {
				const gameId = 1;
				return supertest(app)
					.delete(`/api/v1/games/${gameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUsers[1]))
					.expect(404, { error: `Can't find game.` });
			});

			it(`responds with 204 if request user matches database user`, () => {
				const gameId = 1;
				return supertest(app)
					.delete(`/api/v1/games/${gameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(204);
			});

			it(`responds with 204 if there is a matching gameId`, () => {
				const gameId = 1;
				const expectedGames = testGames.filter(i => i.id != gameId);
				return supertest(app)
					.delete(`/api/v1/games/${gameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(204)
					.then(res => {
						supertest(app)
							.get(`/api/v1/games`)
							.set(
								'Authorization',
								helpers.makeAuthHeader(testUser)
							)
							.expect(expectedGames);
					});
			});
		});
	});

	describe(`GET '/api/v1/games/:gameId'`, () => {
		context('Given there are no games', () => {
			beforeEach('insert tables', () => helpers.seedUsers(db, testUsers));
			it(`responds with 404 'Can't find game.' if there are no games`, () => {
				const gameId = 0;
				return supertest(app)
					.get(`/api/v1/games/${gameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(404, { error: "Can't find game." });
			});
		});
		context('Given there are games', () => {
			beforeEach('insert tables', () =>
				helpers.seedGamesTables(db, testUsers, testGames)
			);

			it(`responds with 404 'Can't find game.' if gameId doesn't exist in database`, () => {
				const nonexistentGameId = 89435;
				return supertest(app)
					.get(`/api/v1/games/${nonexistentGameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(404, { error: "Can't find game." });
			});

			it(`responds with 200 with details on specific game`, () => {
				const testGameId = 1;
				const expectedGame = testGames
					.filter(i => i.id === testGameId)
					.shift();
				return supertest(app)
					.get(`/api/v1/games/${testGameId}`)
					.set('Authorization', helpers.makeAuthHeader(testUser))
					.expect(200, expectedGame);
			});
		});
	});
});
