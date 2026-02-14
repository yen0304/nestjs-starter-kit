import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import {
  PaginationOptions,
  createPaginationResult,
  getSkip,
} from '../../utils/pagination';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
      include: { parent: true },
    });
  }

  async findAll(pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const skip = getSkip(page, limit);

    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        skip,
        take: limit,
        include: { children: true },
        orderBy: { id: 'asc' },
      }),
      this.prisma.category.count(),
    ]);

    return createPaginationResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: true, products: true },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    await this.findOne(id);

    return this.prisma.category.update({
      where: { id },
      data: dto,
      include: { parent: true, children: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.category.delete({ where: { id } });
  }
}
