const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const token = jwt.sign(
    {
        userInfos: {
            id: 4,
            email: 'jonhdoe@gmail.com',
            role: 'PATIENT'
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
);

let transaction;
beforeAll(async () => {
    await sequelize.authenticate();
});
beforeEach(async () => {
    transaction = await sequelize.transaction();
});
afterEach(async () => {
    await transaction.rollback();
});
afterAll(async () => {
    await sequelize.close();
});

describe('Auth Routes', () => {
    it('should return 200 for logged user', async () => {
        const res = await request(app)
        .get('/users/testLogged')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    it('should return my infos', async  () => {
        const res = await request(app)
        .get('/auth/me/4')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return data for appointments", async () => {
        const res = await request(app)
        .get('/auth/getDataForRdv/')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
});
