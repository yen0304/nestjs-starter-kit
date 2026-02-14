import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../core/database/prisma.service';

const mockDate = new Date();

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
  },
};

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto = { name: 'John', email: 'john@test.com', password: '123456' };
      const expected = { id: 1, name: 'John', email: 'john@test.com' };
      mockPrismaService.user.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { name: 'John', email: 'john@test.com' },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const users = [{ id: 1, name: 'John', email: 'john@test.com' }];
      mockPrismaService.user.findMany.mockResolvedValue(users);
      mockPrismaService.user.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(users);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        products: [],
        orders: [],
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto = { name: 'John', email: 'john@test.com', password: '123456' };
      const expected = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        createdAt: mockDate,
        updatedAt: mockDate,
      };
      jest.spyOn(service, 'create').mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should delegate to service.findAll', async () => {
      const expected = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
      jest.spyOn(service, 'findAll').mockResolvedValue(expected);

      const result = await controller.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should delegate to service.findOne', async () => {
      const expected = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        createdAt: mockDate,
        updatedAt: mockDate,
        products: [],
        orders: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(expected);

      const result = await controller.findOne(1);
      expect(result).toEqual(expected);
    });
  });
});
