import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../../core/database/prisma.service';

const mockDate = new Date();

const mockCategory = {
  id: 1,
  name: 'Category',
  parentId: null,
  createdAt: mockDate,
  updatedAt: mockDate,
};

const mockUser = {
  id: 1,
  email: 'test@test.com',
  name: 'Test',
  createdAt: mockDate,
  updatedAt: mockDate,
};

const mockPrismaService = {
  product: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product without tags', async () => {
      const dto = { name: 'iPhone', price: 999, categoryId: 1, createdById: 1 };
      const expected = { id: 1, ...dto, tags: [], category: {}, createdBy: {} };
      mockPrismaService.product.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: 'iPhone',
          price: 999,
          categoryId: 1,
          createdById: 1,
          tags: undefined,
        },
        include: { category: true, tags: true, createdBy: true },
      });
    });

    it('should create a product with tags', async () => {
      const dto = {
        name: 'iPhone',
        price: 999,
        categoryId: 1,
        createdById: 1,
        tagIds: [1, 2],
      };
      const expected = {
        id: 1,
        name: 'iPhone',
        price: 999,
        tags: [{ id: 1 }, { id: 2 }],
        category: {},
        createdBy: {},
      };
      mockPrismaService.product.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockPrismaService.product.create).toHaveBeenCalledWith({
        data: {
          name: 'iPhone',
          price: 999,
          categoryId: 1,
          createdById: 1,
          tags: { connect: [{ id: 1 }, { id: 2 }] },
        },
        include: { category: true, tags: true, createdBy: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const products = [{ id: 1, name: 'iPhone', deletedAt: null }];
      mockPrismaService.product.findMany.mockResolvedValue(products);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(products);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = {
        id: 1,
        name: 'iPhone',
        deletedAt: null,
        category: {},
        tags: [],
        createdBy: {},
      };
      mockPrismaService.product.findFirst.mockResolvedValue(product);

      const result = await service.findOne(1);
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product without tags', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 1,
        name: 'iPhone',
        deletedAt: null,
      });
      const updated = { id: 1, name: 'iPhone Pro', tags: [], category: {} };
      mockPrismaService.product.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'iPhone Pro' });
      expect(result.name).toBe('iPhone Pro');
    });

    it('should update a product with tags', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 1,
        name: 'iPhone',
        deletedAt: null,
      });
      const updated = {
        id: 1,
        name: 'iPhone',
        tags: [{ id: 3 }],
        category: {},
      };
      mockPrismaService.product.update.mockResolvedValue(updated);

      const result = await service.update(1, { tagIds: [3] });
      expect(result.tags).toEqual([{ id: 3 }]);
      expect(mockPrismaService.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { tags: { set: [{ id: 3 }] } },
        include: { category: true, tags: true, createdBy: true },
      });
    });
  });

  describe('remove', () => {
    it('should soft-delete a product', async () => {
      const now = new Date();
      mockPrismaService.product.findFirst.mockResolvedValue({
        id: 1,
        name: 'iPhone',
        deletedAt: null,
      });
      mockPrismaService.product.update.mockResolvedValue({
        id: 1,
        deletedAt: now,
      });

      const result = await service.remove(1);
      expect(result.deletedAt).toBe(now);
    });
  });
});

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should delegate create to service', async () => {
    const dto = { name: 'iPhone', price: 999, categoryId: 1, createdById: 1 };
    jest.spyOn(service, 'create').mockResolvedValue({
      id: 1,
      name: dto.name,
      description: null,
      price: new Prisma.Decimal(dto.price),
      categoryId: dto.categoryId,
      createdById: dto.createdById,
      deletedAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      category: mockCategory,
      tags: [],
      createdBy: mockUser,
    });
    const result = await controller.create(dto);
    expect(result.name).toBe('iPhone');
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
      name: 'iPhone',
      description: null,
      price: new Prisma.Decimal(999),
      categoryId: 1,
      createdById: 1,
      deletedAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      category: mockCategory,
      tags: [],
      createdBy: mockUser,
    });
    const result = await controller.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should delegate update to service', async () => {
    jest.spyOn(service, 'update').mockResolvedValue({
      id: 1,
      name: 'iPhone Pro',
      description: null,
      price: new Prisma.Decimal(999),
      categoryId: 1,
      createdById: 1,
      deletedAt: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      category: mockCategory,
      tags: [],
      createdBy: mockUser,
    });
    const result = await controller.update(1, { name: 'iPhone Pro' });
    expect(result.name).toBe('iPhone Pro');
  });

  it('should delegate remove to service', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({
      id: 1,
      name: 'iPhone',
      description: null,
      price: new Prisma.Decimal(999),
      categoryId: 1,
      createdById: 1,
      deletedAt: new Date(),
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    const result = await controller.remove(1);
    expect(result.id).toBe(1);
  });
});
