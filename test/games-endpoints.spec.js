const knex = require('knex');
const app = require('../src/app');
// const helpers = require('./test-helpers');

describe.only('Games Endpoints', function() {
	let db;

	let testUser = {
		user_name: 'nerd',
		full_name: 'Word Nerd',
		password: 'nerdpass'
	};

	function makeAuthHeader(user) {
		const token = Buffer.from(
			`${user.user_name}:${user.password}`
		).toString('base64');
		return `Basic ${token}`;
	}

	before('make knex instance', () => {
		db = knex({
			client: 'pg',
			connection: process.env.TEST_DB_URL
		});
		app.set('db', db);
	});

	after('disconnect from db', () => db.destroy());

	before('cleanup', () => db.raw('TRUNCATE TABLE words RESTART IDENTITY;'));

	afterEach('cleanup', () =>
		db.raw('TRUNCATE TABLE words RESTART IDENTITY;')
	);

	describe(`GET 'api/v1/games`, () => {
		context(`Given no words`, () => {
			it(`responds with 200 and an empty list`, () => {
				return supertest(app)
					.get('/api/v1/games/')
					.set('Authorization', makeAuthHeader(testUser))
					.expect(200, []);
			});
		});
	});
});
