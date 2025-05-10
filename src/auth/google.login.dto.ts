import { ApiProperty } from "@nestjs/swagger";

export class GoogleLoginDto {
    @ApiProperty({
      description: '구글 로그인 토큰',
      example: 'googleLoginToken',
    })
    idToken: string;
  }
  