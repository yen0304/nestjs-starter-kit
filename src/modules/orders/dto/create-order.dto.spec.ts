import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { CreateOrderDto } from './create-order.dto';

describe('CreateOrderDto', () => {
  it('should transform items via @Type decorator', () => {
    const plain = {
      userId: 1,
      items: [{ productId: 1, quantity: 2, unitPrice: 999 }],
    };

    const instance = plainToInstance(CreateOrderDto, plain);
    expect(instance).toBeInstanceOf(CreateOrderDto);
    expect(instance.items).toBeDefined();
    expect(instance.items.length).toBe(1);
  });
});
