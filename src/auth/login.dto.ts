import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({
      description: '사용자 이메일 주소',
      example: 'user@example.com',
    })
    email: string;
  
    @ApiProperty({
      description: '사용자 비밀번호',
      example: 'securepassword123',
    })
    password: string;
  }
  