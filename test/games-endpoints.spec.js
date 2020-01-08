const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Games Endpoints', function() {
	let db;

	const { testUsers, testGames } = helpers.makeGamesFixtures();
	const testUser = testUsers[0];

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

	beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

	describe(`POST /api/auth/login`, () => {
		it(`has a test`, () => {
			//test here
		});
	});
});
