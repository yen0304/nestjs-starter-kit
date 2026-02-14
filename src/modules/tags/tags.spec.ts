import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { PrismaService } from '../../core/database/prisma.service';

const mockDate = new Date();

const mockPrismaService = {
  tag: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const dto = { name: 'sale' };
      const expected = { id: 1, name: 'sale' };
      mockPrismaService.tag.create.mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all tags with product count', async () => {
      const tags = [{ id: 1, name: 'sale', _count: { products: 5 } }];
      mockPrismaService.tag.findMany.mockResolvedValue(tags);

      const result = await service.findAll();
      expect(result).toEqual(tags);
    });
  });

  describe('findOne', () => {
    it('should return a tag by id', async () => {
      const tag = { id: 1, name: 'sale', products: [] };
      mockPrismaService.tag.findUnique.mockResolvedValue(tag);

      const result = await service.findOne(1);
      expect(result).toEqual(tag);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.tag.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      mockPrismaService.tag.findUnique.mockResolvedValue({
        id: 1,
        name: 'sale',
        products: [],
      });
      mockPrismaService.tag.update.mockResolvedValue({ id: 1, name: 'promo' });

      const result = await service.update(1, { name: 'promo' });
      expect(result.name).toBe('promo');
    });
  });

  describe('remove', () => {
    it('should delete a tag', async () => {
      mockPrismaService.tag.findUnique.mockResolvedValue({
        id: 1,
        name: 'sale',
        products: [],
      });
      mockPrismaService.tag.delete.mockResolvedValue({ id: 1, name: 'sale' });

      const result = await service.remove(1);
      expect(result.id).toBe(1);
    });
  });
});

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        TagsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
    jest.clearAllMocks();
  });

  it('should delegate create to service', async () => {
    jest.spyOn(service, 'create').mockResolvedValue({
      id: 1,
      name: 'sale',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    const result = await controller.create({ name: 'sale' });
    expect(result.name).toBe('sale');
  });

  it('should delegate findAll to service', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([]);
    const result = await controller.findAll();
    expect(result).toEqual([]);
  });

  it('should delegate findOne to service', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 1,
      name: 'sale',
      createdAt: mockDate,
      updatedAt: mockDate,
      products: [],
    });
    const result = await controller.findOne(1);
    expect(result.id).toBe(1);
  });

  it('should delegate update to service', async () => {
    jest.spyOn(service, 'update').mockResolvedValue({
      id: 1,
      name: 'promo',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    const result = await controller.update(1, { name: 'promo' });
    expect(result.name).toBe('promo');
  });

  it('should delegate remove to service', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({
      id: 1,
      name: 'sale',
      createdAt: mockDate,
      updatedAt: mockDate,
    });
    const result = await controller.remove(1);
    expect(result.id).toBe(1);
  });
});
