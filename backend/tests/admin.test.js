const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');
const sequelize = require('../database/config.js');
const User = require('../models/User.js');
const Medecin = require('../models/Medecin.js');
const Specialite = require('../models/Specialite.js');
require('dotenv').config();


const token = jwt.sign(
    {
        userInfos: {
            id: 1,
            email: 'ibrahima-bila.diop@epitech.eu',
            role: 'ADMIN'
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
describe('Admin Routes', () => {
    it('should return all users', async () => {
        const res = await request(app)
        .get('/admin/allUsers')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toBeDefined();
    });

    it('should add a medecin', async () => {
    const res = await request(app)
      .post('/admin/addMedecin')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nom: "Dr Test",
        prenom: "Test",
        email: "drtest@test.com",
        password: "Test1234!",
        specialite_id: 1,
      });
    expect([200, 201]).toContain(res.statusCode);
  });
  it('should return all specialites', async () => {
    const res = await request(app)
      .get('/admin/getAllSpecialites')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
  it('should deny access without token', async () => {
    const res = await request(app)
      .get('/admin/allUsers');

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
})

