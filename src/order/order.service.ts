import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number) {
    const cartItems = await this.prisma.cart.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('장바구니가 비어 있습니다.');
    }

    const orders:any[] = [];

    for (const item of cartItems) {
      if (item.quantity > item.product.stockQuantity) {
        throw new BadRequestException(`재고 부족: ${item.product.name}`);
      }

      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { decrement: item.quantity } },
      });

      const order = await this.prisma.order.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: item.productId } },
          quantity: item.quantity,
          totalPrice: item.product.price * item.quantity,
          status: 'paid',
        },
      });

      orders.push(order);
    }

    await this.prisma.cart.deleteMany({ where: { userId } });

    return orders;
  }

  async findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: true, // ← 단일 상품 정보를 포함시킴
      },
    });
  }
  
}
