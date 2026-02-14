import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { PrismaService } from '../../core/database/prisma.service';

const mockDate = new Date();

const mockPrismaService = {
  category: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
};

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { name: 'Electronics' };
      const expected = {
        id: 1,
        name: 'Electronics',
        parentId: null,
        parent: null,
      };
      mockPrismaService.category.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(mockPrismaService.category.create).toHaveBeenCalledWith({
        data: dto,
        include: { parent: true },
      });
    });

    it('should create a subcategory with parentId', async () => {
      const dto = { name: 'Phones', parentId: 1 };
      const expected = {
        id: 2,
        name: 'Phones',
        parentId: 1,
        parent: { id: 1, name: 'Electronics' },
      };
      mockPrismaService.category.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result.parentId).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return paginated categories', async () => {
      const categories = [{ id: 1, name: 'Electronics', children: [] }];
      mockPrismaService.category.findMany.mockResolvedValue(categories);
      mockPrismaService.category.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toEqual(categories);
      expect(result.total).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category = {
        id: 1,
        name: 'Electronics',
        parent: null,
        children: [],
        products: [],
      };
      mockPrismaService.category.findUnique.mockResolvedValue(category);

      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const existing = {
        id: 1,
        name: 'Electronics',
        parent: null,
        children: [],
        products: [],
      };
      mockPrismaService.category.findUnique.mockResolvedValue(existing);
      const updated = { ...existing, name: 'Tech', children: [] };
      mockPrismaService.category.update.mockResolvedValue(updated);

      const result = await service.update(1, { name: 'Tech' });
      expect(result.name).toBe('Tech');
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const existing = {
        id: 1,
        name: 'Electronics',
        parent: null,
        children: [],
        products: [],
      };
      mockPrismaService.category.findUnique.mockResolvedValue(existing);
      mockPrismaService.category.delete.mockResolvedValue(existing);

      const result = await service.remove(1);
      expect(result).toEqual(existing);
    });
  });
});

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should delegate create to service', async () => {
    const dto = { name: 'Electronics' };
    jest.spyOn(service, 'create').mockResolvedValue({
      id: 1,
      name: dto.name,
      parentId: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      parent: null,
    });
    const result = await controller.create(dto);
    expect(result.name).toBe('Electronics');
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
      name: 'Electronics',
      parentId: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      parent: null,
      children: [],
      products: [],
    });
    const result = await controller.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should delegate update to service', async () => {
    jest.spyOn(service, 'update').mockResolvedValue({
      id: 1,
      name: 'Tech',
      parentId: null,
      createdAt: mockDate,
      updatedAt: mockDate,
      parent: null,
      children: [],
    });
    const result = await controller.update(1, { name: 'Tech' });
    expect(result.name).toBe('Tech');
  });

  it('should delegate remove to service', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({
      id: 1,
      name: 'Electronics',
      parentId: null,
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    const result = await controller.remove(1);
    expect(result.id).toBe(1);
  });
});
