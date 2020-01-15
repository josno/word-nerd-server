const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Games Protected Endpoints', function() {
	let db;
	const { testUsers, testGames } = helpers.makeGamesFixtures();

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DATABASE_URL
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => helpers.cleanTables(db));

	afterEach('cleanup', () => helpers.cleanTables(db));

	beforeEach('insert users', () =>
		helpers.seedGamesTables(db, testUsers, testGames)
	);

	describe(`GET '/api/v1/games'`, () => {
		it(`responds 401 'Missing bearer token' when no bearer token`, () => {
			return supertest(app)
				.get('/api/v1/games')
				.expect(401, { error: `Missing bearer token` });
		});

		it(`responds with 401 'Unauthorized request' when user doesn't exist`, () => {
			const invalidUser = { user_name: 'nonexistent', id: 4 };
			return supertest(app)
				.get('/api/v1/games')
				.set('Authorization', helpers.makeAuthHeader(invalidUser))
				.expect(401, { error: `Unauthorized request` });
		});

		it(`responds with 401 'Unauthorized request' when JWT is invalid`, () => {
			const validUser = testUsers[0];
			const invalidSecret = 'invalid-secret';
			return supertest(app)
				.get('/api/v1/games')
				.set(
					'Authorization',
					helpers.makeAuthHeader(validUser, invalidSecret)
				)
				.expect(401, { error: `Unauthorized request` });
		});
	});

	describe(`POST '/api/v1/games`, () => {
		it(`responds 401 'Missing bearer token' when no bearer token`, () => {
			return supertest(app)
				.post('/api/v1/games')
				.expect(401, { error: `Missing bearer token` });
		});

		it(`responds with 401 'Unauthorized request' when user doesn't exist`, () => {
			const invalidUser = { user_name: 'nonexistent', id: 4 };
			return supertest(app)
				.post('/api/v1/games')
				.set('Authorization', helpers.makeAuthHeader(invalidUser))
				.expect(401, { error: `Unauthorized request` });
		});

		it(`responds with 401 'Unauthorized request' when JWT is invalid`, () => {
			const validUser = testUsers[0];
			const invalidSecret = 'invalid-secret';
			return supertest(app)
				.post('/api/v1/games')
				.set(
					'Authorization',
					helpers.makeAuthHeader(validUser, invalidSecret)
				)
				.expect(401, { error: `Unauthorized request` });
		});
	});

	describe(`GET '/api/v1/games/:game_id`, () => {
		it(`responds 401 'Missing bearer token' when no bearer token`, () => {
			return supertest(app)
				.get('/api/v1/games/2')
				.expect(401, { error: `Missing bearer token` });
		});

		it(`responds with 401 'Unauthorized request' when user doesn't exist`, () => {
			const invalidUser = { user_name: 'nonexistent', id: 4 };
			return supertest(app)
				.get('/api/v1/games/2')
				.set('Authorization', helpers.makeAuthHeader(invalidUser))
				.expect(401, { error: `Unauthorized request` });
		});

		it(`responds with 401 'Unauthorized request' when JWT is invalid`, () => {
			const validUser = testUsers[0];
			const invalidSecret = 'invalid-secret';
			return supertest(app)
				.get('/api/v1/games/1')
				.set(
					'Authorization',
					helpers.makeAuthHeader(validUser, invalidSecret)
				)
				.expect(401, { error: `Unauthorized request` });
		});
	});
});
