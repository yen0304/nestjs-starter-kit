import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import {
  PaginationOptions,
  createPaginationResult,
  getSkip,
} from '../../utils/pagination';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    const { tagIds, ...data } = dto;

    return this.prisma.product.create({
      data: {
        ...data,
        tags: tagIds?.length
          ? { connect: tagIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { category: true, tags: true, createdBy: true },
    });
  }

  async findAll(pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const skip = getSkip(page, limit);

    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true, tags: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginationResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, tags: true, createdBy: true },
    });

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);

    const { tagIds, ...data } = dto;

    return this.prisma.product.update({
      where: { id },
      data: {
        ...data,
        tags: tagIds ? { set: tagIds.map((id) => ({ id })) } : undefined,
      },
      include: { category: true, tags: true, createdBy: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Soft delete — set deletedAt timestamp
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
