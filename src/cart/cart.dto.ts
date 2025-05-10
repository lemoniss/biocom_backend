import { ApiProperty } from '@nestjs/swagger';

export class CartDto {
  @ApiProperty({ description: '상품 ID', example: 1 })
  productId: number;

  @ApiProperty({ description: '장바구니에 담을 수량', example: 3 })
  quantity: number; 
}
