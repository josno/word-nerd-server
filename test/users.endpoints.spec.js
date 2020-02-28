const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function() {
	let db;

	const { testUsers } = helpers.makeGamesFixtures();
	const testUser = testUsers[0];

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

	describe(`POST /api/v1/users`, () => {
		context(`User Validation`, () => {
			beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

			const requiredFields = ['user_name', 'password', 'full_name'];

			requiredFields.forEach(field => {
				const registerAttemptBody = {
					user_name: 'test user_name',
					password: 'test password',
					full_name: 'test full_name'
				};

				it(`responds with 400 required error when '${field}' is missing`, () => {
					delete registerAttemptBody[field];

					return supertest(app)
						.post('/api/v1/users')
						.send(registerAttemptBody)
						.expect(400, {
							error: `Missing '${field}' in request body`
						});
				});
			});

			it(`responds 400 'Password should be longer' when password is short`, () => {
				const userShortPassword = {
					user_name: 'test user_name',
					password: '1234567',
					full_name: 'test full_name'
				};
				return supertest(app)
					.post('/api/v1/users')
					.send(userShortPassword)
					.expect(400, {
						error: `Password should be longer.`
					});
			});

			it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
				const userLongPass = {
					user_name: 'test user_name',
					password: '*'.repeat(73),
					full_name: 'test full_name'
				};

				return supertest(app)
					.post('/api/v1/users')
					.send(userLongPass)
					.expect(400, {
						error: `Password must be less than 72 characters`
					});
			});

			it(`responds 400 'Username is already taken', when user_name is duplicated`, () => {
				const duplicatedUser = {
					user_name: testUser.user_name,
					password: 'blahblah',
					full_name: 'test full_name'
				};

				return supertest(app)
					.post('/api/v1/users')
					.send(duplicatedUser)
					.expect(400, { error: 'Username is already taken.' });
			});

			it(`respond 400 'Username cannot have spaces' when username is formatted incorrectly`, () => {
				const badUsername = {
					user_name: 'testuser space',
					password: 'blahblah',
					full_name: 'test full_name'
				};

				return supertest(app)
					.post('/api/v1/users')
					.send(badUsername)
					.expect(400, { error: 'Username cannot have spaces.' });
			});
		});

		context.only('Given an xss attack', () => {
			it('removes xss from the response body', () => {
				const maliciousUser = {
					user_name: '<script>badusername</script>',
					full_name: 'user <script>name</script>',
					password: '<script>password</script>'
				};

				return supertest(app)
					.post('/api/v1/users')
					.send(maliciousUser)
					.expect(res => {
						expect(res.body.user.user_name).to.eql(
							'&lt;script&gt;badusername&lt;/script&gt;'
						);
						expect(res.body.user.full_name).to.eql(
							'user &lt;script&gt;name&lt;/script&gt;'
						);
					});
			});
		});

		context(`Inserts new user credentials and inserts to database`, () => {
			it(`responds 201, serialized user, storing bcryped password`, () => {
				const newUser = {
					user_name: 'testuser_name',
					password: '11AAaa!!',
					full_name: 'test full_name'
				};

				return supertest(app)
					.post('/api/v1/users')
					.send(newUser)
					.expect(201)
					.expect(res => {
						expect(res.body.user.user_name).to.eql(
							newUser.user_name
						);
						expect(res.body.user.full_name).to.eql(
							newUser.full_name
						);
						expect(res.body).to.not.have.property('password');
						const expectedDate = new Date().toLocaleString('en', {
							timeZone: 'UTC'
						});
						const actualDate = new Date(
							res.body.user.date_created
						).toLocaleString();
						expect(actualDate).to.eql(expectedDate);
					})
					.expect(res =>
						db
							.from('users')
							.select('*')
							.where({ id: res.body.user.id })
							.first() /*return the first row*/
							.then(row => {
								/*'row' is returned entry*/
								expect(row.user_name).to.eql(newUser.user_name);
								expect(row.full_name).to.eql(newUser.full_name);
								expect(row.date_modified).to.eql(null);
								const expectedDate = new Date().toLocaleString(
									'en',
									{ timeZone: 'UTC' }
								);
								const actualDate = new Date(
									row.date_created
								).toLocaleString();
								expect(actualDate).to.eql(expectedDate);

								return bcrypt.compare(
									newUser.password,
									row.password
								);
							})
							.then(compareMatch => {
								expect(compareMatch).to.be.true;
							})
					);
			});
		});
	});
});
