import { Controller, Post, Get, Param, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @ApiOperation({ summary: '상품 등록', description: '신규 상품 정보를 등록합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @ApiOperation({ summary: '상품 전체 조회', description: '전체 상품을 조회 합니다.' })
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @ApiOperation({ summary: '상품 상세 조회', description: '특정 상품을 상세조회 합니다.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(Number(id));
  }

  @ApiOperation({ summary: '상품 수정', description: '기존 상품 정보를 수정합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update(Number(id), dto);
  }

  @ApiOperation({ summary: '상품 삭제', description: '상품 정보를 삭제합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.productService.delete(Number(id));
  }
}
