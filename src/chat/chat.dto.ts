// src/chat/chat.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty({ description: '받는 사람의 사용자 ID', example: 2 })
  receiverId: number;

  @ApiProperty({ description: '메시지 내용', example: '안녕하세요.' })
  content: string;
}
