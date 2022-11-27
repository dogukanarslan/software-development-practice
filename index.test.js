const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('./');

require('dotenv').config();

// Connecting to the database before each test.
beforeEach(async () => {
  console.log('Connecting to MongoDB');
  await mongoose.connect(process.env.MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
});

// Closing database connection after each test.
afterEach(async () => {
  await mongoose.connection.close();
});

describe('Fetch pins', () => {
  const date = Date.now();

  test('signup', async () => {
    const signupResponse = await request(app)
      .post('/signup')
      .send({ email: `${date}@mail.com`, password: '123456' });
    expect(signupResponse.statusCode).toBe(201);
    expect(signupResponse.body).toHaveProperty('user');
  });

  let token = '';

  test('login', async () => {
    const loginResponse = await request(app)
      .post('/login')
      .send({ email: `${date}@mail.com`, password: '123456' });

    token = loginResponse.header['set-cookie'].find((cookie) =>
      cookie.includes('authentication')
    );

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('user');
  });

  test('create pin', async () => {
    const createPinResponse = await request(app)
      .post('/pins/create')
      .set('Cookie', [token])
      .send({
        title: `Test pin`,
        description: 'Test description',
        link: 'https://www.google.com/',
      });
    expect(createPinResponse.statusCode).toBe(200);
    expect(createPinResponse.body).toHaveProperty('pin');
  });
});
