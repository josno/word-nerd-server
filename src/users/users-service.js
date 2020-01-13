const xss = require('xss');
const bcrypt = require('bcryptjs');

const UsersService = {
	insertNewUser(db, newUser) {
		return db
			.insert(newUser)
			.into('users')
			.returning('*')
			.then(([user]) => user);
	},
	hasUserWithUserName(db, user_name) {
		return db('users')
			.where({ user_name })
			.first()
			.then(user => !!user);
	},
	validatePassword(password) {
		if (password.length < 8) {
			return 'Password should be longer.';
		}
		if (password.length > 72) {
			return 'Password must be less than 72 characters';
		}
	},
	serializeUser(user) {
		return {
			id: user.id,
			full_name: xss(user.full_name),
			user_name: xss(user.user_name),
			date_created: new Date(user.date_created)
		};
	},
	hashPassword(password) {
		return bcrypt.hash(password, 12);
	}
};

module.exports = UsersService;
