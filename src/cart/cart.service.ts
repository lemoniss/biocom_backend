import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartDto } from './cart.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async addToCart(userId: number, dto: CartDto) {
        // 1. 상품 정보 조회 (재고 확인용)
        const product = await this.prisma.product.findUnique({
          where: { id: dto.productId },
        });
      
        if (!product) {
          throw new BadRequestException('해당 상품이 존재하지 않습니다.');
        }
      
        if (dto.quantity < 1) {
          throw new BadRequestException('수량은 1개 이상이어야 합니다.');
        }
      
        // 2. 기존 장바구니 항목 조회
        const existing = await this.prisma.cart.findFirst({
          where: { userId, productId: dto.productId },
        });
      
        const newQuantity = existing
          ? existing.quantity + dto.quantity
          : dto.quantity;
      
        // 3. 재고 초과 체크
        if (newQuantity > product.stockQuantity) {
          throw new BadRequestException(
            `재고 수량(${product.stockQuantity}개)을 초과할 수 없습니다.`,
          );
        }
      
        // 4. 업데이트 또는 새로 생성
        if (existing) {
          return this.prisma.cart.update({
            where: { id: existing.id },
            data: { quantity: newQuantity },
          });
        }
      
        return this.prisma.cart.create({
          data: {
            userId,
            productId: dto.productId,
            quantity: dto.quantity,
          },
        });
      }

    async getUserCart(userId: number) {
        return this.prisma.cart.findMany({
            where: { userId },
            include: { product: true },
        });
    }

    async updateQuantity(cartId: number, dto: CartDto) {
        const cart = await this.prisma.cart.findUnique({
          where: { id: cartId },
          include: { product: true },
        });
      
        if (!cart) {
          throw new NotFoundException('장바구니 항목을 찾을 수 없습니다.');
        }
      
        if (dto.quantity < 1) {
          throw new BadRequestException('수량은 1개 이상이어야 합니다.');
        }
      
        if (dto.quantity > cart.product.stockQuantity) {
          throw new BadRequestException('재고 수량을 초과할 수 없습니다.');
        }
      
        return this.prisma.cart.update({
          where: { id: cartId },
          data: { quantity: dto.quantity },
        });
      }
      

    async remove(id: number) {
        return this.prisma.cart.delete({ where: { id } });
    }

}
