import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto { 
  @ApiProperty({
    description: '모의 결제 여부 (true면 결제 처리로 간주)',
    example: true,
  })
  mockPayment: boolean;
}