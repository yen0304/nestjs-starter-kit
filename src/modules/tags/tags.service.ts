import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    return this.prisma.tag.create({ data: dto });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }

    return tag;
  }

  async update(id: number, dto: UpdateTagDto) {
    await this.findOne(id);

    return this.prisma.tag.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.tag.delete({ where: { id } });
  }
}
