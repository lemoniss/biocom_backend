import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(dto: ProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async findAll() {
    return this.prisma.product.findMany({
      where: { isDel: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product || product.isDel) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: ProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { isDel: true },
    });
  }
}
