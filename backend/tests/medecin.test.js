const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const token = jwt.sign(
    {
        userInfos: {
            id: 11,
            email: 'davidperez@gmail.com',
            role: 'MEDECIN'
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
describe('Medecin Routes', () => {
    it("should return my rdvs", async () => {
        const res = await request(app)
        .get('/medecin/getMyRdvs/11')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return dossiers patients", async () => {
        const res = await request(app)
        .get('/medecin/getDossierPatients/11')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return 404", async () => {
        const res = await request(app)
        .get('/medecin/nonExistentRoute')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    })
})