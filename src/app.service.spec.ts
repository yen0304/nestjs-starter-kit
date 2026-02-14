import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(() => {
    service = new AppService();
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      expect(service.getHello()).toBe(
        'Hello World! NestJS Starter Kit is running!',
      );
    });
  });

  describe('getHealth', () => {
    it('should return status ok', () => {
      const result = service.getHealth();
      expect(result.status).toBe('ok');
    });

    it('should return an ISO timestamp', () => {
      const result = service.getHealth();
      expect(() => new Date(result.timestamp)).not.toThrow();
    });
  });
});
