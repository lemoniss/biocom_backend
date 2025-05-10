import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { GoogleLoginDto } from './google.login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: '일반 로그인', description: '이메일과 비밀번호로 로그인합니다.' })
    login(@Body() dto: LoginDto) {
      return this.authService.login(dto.email, dto.password);
    }
  
    @Post('google')
    @ApiOperation({ summary: 'Google 소셜 로그인', description: 'Google ID Token을 이용한 로그인입니다.' })
    loginWithGoogle(@Body() dto: GoogleLoginDto) {
      return this.authService.loginWithGoogle(dto.idToken);
    }
}
