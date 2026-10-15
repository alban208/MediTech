const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');

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

describe('User Routes', () => {
    it('should return stats', async () => {
        const rest = await request(app)
        .get('/users/stats');
        expect(rest.statusCode).toBe(200);
    });
    it('should return 401', async () => {
        const res = await request(app)
        .get('/users/nonExistentRoute');
        expect(res.statusCode).toBe(401);
    });
})