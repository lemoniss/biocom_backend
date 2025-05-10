import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({ description: '게시물 내용', example: '게시물 내용이 들어갑니다.' })
  content: string;

  @ApiProperty({
    description: '이미지 URL (선택사항)',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imageUrl?: string;

  
}