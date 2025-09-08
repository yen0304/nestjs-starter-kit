import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import {
  PaginationOptions,
  createPaginationResult,
} from '../../utils/pagination';
import { PrismaService } from '../../core/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 這裡是範例，實際使用時需要根據 Prisma schema 調整
    return {
      message: 'User created successfully',
      data: createUserDto,
    };
  }

  async findAll(paginationOptions: PaginationOptions) {
    const { page, limit } = paginationOptions;

    // 這裡是範例，實際使用時需要根據 Prisma schema 調整
    const mockData = [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    ];

    return createPaginationResult(mockData, mockData.length, page, limit);
  }

  async findOne(id: string) {
    // 這裡是範例，實際使用時需要根據 Prisma schema 調整
    return {
      id,
      name: 'John Doe',
      email: 'john@example.com',
    };
  }
}
