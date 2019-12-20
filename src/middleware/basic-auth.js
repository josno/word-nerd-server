function requireAuth(req, res, next) {
	const authToken = req.get('Authorization') || '';

	let basicToken;
	if (!authToken.toLowerCase().startsWith('basic ')) {
		return res.status(401).json({ error: 'Missing basic token' });
	} else {
		basicToken = authToken.slice('basic '.length, authToken.length);
	}

	const [tokenUserName, tokenPassword] = Buffer.from(basicToken, 'base64')
		.toString()
		.split(':');

	if (!tokenUserName === 'dunder' || !tokenPassword === 'password') {
		return res.status(401).json({ error: 'Wrong Credentials' });
	}

	next();
}

module.exports = { requireAuth };
