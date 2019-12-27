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
					.get('/api/v1/games')
					.expect(200, []);
			});
		});
	});
});
