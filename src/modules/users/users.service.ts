import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import {
  PaginationOptions,
  createPaginationResult,
  getSkip,
} from '../../utils/pagination';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
      },
    });
  }

  async findAll(paginationOptions: PaginationOptions) {
    const { page, limit } = paginationOptions;
    const skip = getSkip(page, limit);

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: 'asc' },
      }),
      this.prisma.user.count(),
    ]);

    return createPaginationResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { products: true, orders: true },
    });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    return user;
  }
}
