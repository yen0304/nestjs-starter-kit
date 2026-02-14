import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import {
  PaginationOptions,
  createPaginationResult,
  getSkip,
} from '../../utils/pagination';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        userId: dto.userId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: { include: { product: true } },
        user: true,
      },
    });
  }

  async findAll(pagination: PaginationOptions) {
    const { page, limit } = pagination;
    const skip = getSkip(page, limit);

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: true,
          items: { include: { product: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return createPaginationResult(data, total, page, limit);
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);

    return this.prisma.order.update({
      where: { id },
      data: dto,
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
  }
}
