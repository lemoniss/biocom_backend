import { ApiProperty } from '@nestjs/swagger';

export class UserDto {

    @ApiProperty({ description: '이메일', example: 'id@email.com', required: false })
    email: string;

    @ApiProperty({ description: '비밀번호', example: 'password', required: false })
    password?: string;

    @ApiProperty({ description: '사용자 이름', example: '홍길동', required: false })
    name: string;

    @ApiProperty({ description: '프로필 이미지 URL', example: 'https://example.com/profile.jpg', required: false })
    profileImg?: string;
}
