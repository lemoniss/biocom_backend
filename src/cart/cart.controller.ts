import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartDto } from './cart.dto';

@ApiTags('Cart')
@Controller('carts')
export class CartController {
  constructor(private cartService: CartService) {}

  @ApiOperation({ summary: '장바구니 추가', description: '상품을 장바구니에 담습니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  addToCart(@Body() dto: CartDto, @Req() req) {
    return this.cartService.addToCart(req.user.userId, dto);
  }

  @ApiOperation({ summary: '내 장바구니 목록', description: '장바구니 목록을 조회합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getMyCart(@Req() req) {
    return this.cartService.getUserCart(req.user.userId);
  }

  @ApiOperation({ summary: '장바구니 수량 수정', description: '장바구니에 담긴 상품의 수량을 변경합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateQuantity(@Param('id') id: string, @Body() dto: CartDto) {
    return this.cartService.updateQuantity(Number(id), dto);
  }

  @ApiOperation({ summary: '장바구니 삭제', description: '장바구니에 담긴 상품을 삭제합니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(Number(id));
  }
  
}
