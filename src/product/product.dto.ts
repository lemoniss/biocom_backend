import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ description: '상품명', example: '오메가3 캡슐' })
  name: string;

  @ApiProperty({ description: '상품 설명', example: '눈 건강에 좋은 고급 오메가3' })
  description: string;

  @ApiProperty({ description: '가격', example: 19900 })
  price: number;

  @ApiProperty({ description: '재고 수량', example: 100 })
  stockQuantity: number;

  @ApiProperty({
    description: '상품 이미지 URL',
    example: 'https://example.com/images/omega3.jpg',
    required: false,
  })
  imageUrl?: string;
}
