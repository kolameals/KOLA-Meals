import { testUtils } from '../utils/test-utils';
import { authService } from '../../services/auth.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Auth Service', () => {
  beforeEach(async () => {
    await testUtils.cleanupTestData();
  });

  describe('register', () => {
    it('should register a new user with email and password', async () => {
      const unique = Date.now();
      const email = `test${unique}@example.com`;
      const phoneNumber = `+1234567890${unique}`;
      const password = 'Password123!';
      const name = 'Test User';
      const response = await authService.register(email, password, name, phoneNumber);
      expect(response.user.email).toBe(email);
    });

    it('should not register a user with existing email', async () => {
      const unique = Date.now();
      const email = `test${unique}@example.com`;
      const phoneNumber = `+1234567890${unique}`;
      const password = 'Password123!';
      const name = 'Test User';
      await authService.register(email, password, name, phoneNumber);
      await expect(authService.register(email, password, name, phoneNumber)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should login a user with correct credentials', async () => {
      const unique = Date.now();
      const email = `test${unique}@example.com`;
      const phoneNumber = `+1234567890${unique}`;
      const password = 'Password123!';
      const name = 'Test User';
      await authService.register(email, password, name, phoneNumber);
      const response = await authService.login(email, password);
      expect(response.token).toBeDefined();
    });

    it('should not login a user with incorrect password', async () => {
      const unique = Date.now();
      const email = `test${unique}@example.com`;
      const phoneNumber = `+1234567890${unique}`;
      const password = 'Password123!';
      const name = 'Test User';
      await authService.register(email, password, name, phoneNumber);
      await expect(authService.login(email, 'wrongpassword')).rejects.toThrow();
    });
  });
}); 