import request from 'supertest';
import { app } from '../../app';
import { testUtils } from '../utils/test-utils';

describe('Meal Routes', () => {
  let adminToken: string;
  let userToken: string;
  let adminUser: any;
  let regularUser: any;

  beforeEach(async () => {
    await testUtils.cleanupTestData();

    // Create admin user
    adminUser = await testUtils.createTestUser({
      email: 'admin@example.com',
      phoneNumber: '+1234567890',
      role: 'ADMIN',
    });
    adminToken = testUtils.generateTestToken(adminUser.id, 'ADMIN');

    // Create regular user
    regularUser = await testUtils.createTestUser({
      email: 'test@example.com',
      phoneNumber: '+1234567891',
      password: 'password123',
      role: 'CUSTOMER',
    });
    userToken = testUtils.generateTestToken(regularUser.id, 'CUSTOMER');
  });

  describe('POST /api/meals', () => {
    it('should create a new meal when admin', async () => {
      const mealData = {
        name: 'Test Meal',
        description: 'Test Description',
        price: 10.99,
        category: 'Test Category',
      };

      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(mealData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(mealData.name);
    });

    it('should not create a meal when not admin', async () => {
      const mealData = {
        name: 'Test Meal',
        description: 'Test Description',
        price: 10.99,
        category: 'Test Category',
      };

      const response = await request(app)
        .post('/api/meals')
        .set('Authorization', `Bearer ${userToken}`)
        .send(mealData);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /api/meals', () => {
    beforeEach(async () => {
      // Create some test meals
      await testUtils.createTestMeal({ name: 'Meal 1' });
      await testUtils.createTestMeal({ name: 'Meal 2' });
    });

    it('should get all meals', async () => {
      const response = await request(app)
        .get('/api/meals')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should filter meals by category', async () => {
      const response = await request(app)
        .get('/api/meals?category=Test Category')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /api/meals/:id', () => {
    let testMeal: any;

    beforeEach(async () => {
      testMeal = await testUtils.createTestMeal({ name: 'Original Name' });
    });

    it('should update a meal when admin', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/api/meals/${testMeal.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
    });

    it('should not update a meal when not admin', async () => {
      const updateData = {
        name: 'Updated Name',
      };

      const response = await request(app)
        .put(`/api/meals/${testMeal.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData);

      expect(response.status).toBe(403);
    });
  });
}); 