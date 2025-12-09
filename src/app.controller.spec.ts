import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('getCurrency', () => {
    let appController: AppController;
    let mockGet: jest.Mock;

    beforeEach(async () => {
      jest.resetAllMocks();

      mockGet = jest.fn().mockResolvedValue({
        data: { base_code: 'USD', rates: { EUR: 1 } },
      });

      const axiosModule = require('axios');
      (axiosModule as any).create = jest.fn().mockReturnValue({
        get: mockGet,
      });

      const app: TestingModule = await Test.createTestingModule({
        controllers: [AppController],
        providers: [AppService],
      }).compile();

      appController = app.get<AppController>(AppController);
    });

    it('debería llamar al endpoint externo con la currency correcta', async () => {
      await appController.getCurrency('USD');

      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith('/USD');
    });

    it('debería devolver el string formateado con los datos de la respuesta', async () => {
      const data = { base_code: 'EUR', rates: { USD: 1.1 } };

      mockGet.mockResolvedValueOnce({ data });

      const result = await appController.getCurrency('EUR');

      expect(result).toBe(`Currency requested: ${JSON.stringify(data)}`);
    });
  });
});
