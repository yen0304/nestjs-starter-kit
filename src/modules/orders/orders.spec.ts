import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '../../core/database/prisma.service';

const mockDate = new Date();

const mockUser = {
  id: 1,
  email: 'test@test.com',
  name: 'Test',
  createdAt: mockDate,
  updatedAt: mockDate,
};

const mockPrismaService = {
  order: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const dto = {
        userId: 1,
        items: [{ productId: 1, quantity: 2, unitPrice: 999 }],
      };
      const expected = {
        id: 1,
        userId: 1,
        status: 'PENDING',
        items: [{ productId: 1, quantity: 2, unitPrice: 999, product: {} }],
        user: {},
      };
      mockPrismaService.order.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockPrismaService.order.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          items: {
            create: [{ productId: 1, quantity: 2, unitPrice: 999 }],
          },
        },
        include: {
          items: { include: { product: true } },
          user: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const orders = [{ id: 1, status: 'PENDING', items: [], user: {} }];
      mockPrismaService.order.findMany.mockResolvedValue(orders);
      mockPrismaService.order.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(orders);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return an order by id', async () => {
      const order = { id: 1, status: 'PENDING', items: [], user: {} };
      mockPrismaService.order.findUnique.mockResolvedValue(order);

      const result = await service.findOne(1);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.order.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update order status', async () => {
      const existing = { id: 1, status: 'PENDING', items: [], user: {} };
      mockPrismaService.order.findUnique.mockResolvedValue(existing);
      const updated = { ...existing, status: 'CONFIRMED' };
      mockPrismaService.order.update.mockResolvedValue(updated);

      const result = await service.update(1, { status: OrderStatus.CONFIRMED });
      expect(result.status).toBe('CONFIRMED');
    });
  });
});

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should delegate create to service', async () => {
    const dto = {
      userId: 1,
      items: [{ productId: 1, quantity: 2, unitPrice: 999 }],
    };
    jest.spyOn(service, 'create').mockResolvedValue({
      id: 1,
      userId: 1,
      status: OrderStatus.PENDING,
      createdAt: mockDate,
      updatedAt: mockDate,
      items: [],
      user: mockUser,
    });
    const result = await controller.create(dto);
    expect(result.id).toBe(1);
  });

  it('should delegate findAll to service', async () => {
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

  it('should delegate findOne to service', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 1,
      userId: 1,
      status: OrderStatus.PENDING,
      createdAt: mockDate,
      updatedAt: mockDate,
      items: [],
      user: mockUser,
    });
    const result = await controller.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should delegate update to service', async () => {
    jest.spyOn(service, 'update').mockResolvedValue({
      id: 1,
      userId: 1,
      status: OrderStatus.SHIPPED,
      createdAt: mockDate,
      updatedAt: mockDate,
      items: [],
      user: mockUser,
    });
    const result = await controller.update(1, { status: OrderStatus.SHIPPED });
    expect(result.status).toBe('SHIPPED');
  });
});
