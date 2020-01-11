process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';

require('dotenv').config();

process.env.TEST_DB_URL =
	process.env.TEST_DB_URL ||
	'postgresql://word_nerd_user@localhost:5432/word_nerd_test';

const { expect } = require('chai');
const supertest = require('supertest');

global.expect = expect;
global.supertest = supertest;
