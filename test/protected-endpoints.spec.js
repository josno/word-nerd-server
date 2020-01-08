const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Games Protected Endpoints', function() {
	let db;
	const { testUsers, testGames } = helpers.makeGamesFixtures();

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

	beforeEach('insert test information', () => {
		helpers.seedTestTables(db, testUsers, testGames);
	});

	describe(`GET 'api/v1/games/`, () => {
		context(`Given no words`, () => {
			const user = { user_name: 'dunder', password: 'dunderpass' };
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get('/api/v1/games/')
					.set('Authorization', helpers.makeAuthHeader(db, user))
					.expect(200, []);
			});

			it(`responds 401 'Missing basic token' when no basic token`, () => {
				const missingTokenUser = { user_name: '', password: '' };
				return supertest(app)
					.get('api/v1/games/')
					.set(
						'Authorization',
						helpers.makeAuthHeader(missingTokenUser)
					)
					.expect(401, { error: 'Missing basic token' });
			});
		});
	});
});
