import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @ApiOperation({ summary: '사용자 정보 생성', description: '사용자 정보를 생성합니다.' })
    @Post('signup')
    async signup(@Body() dto: UserDto) {
        return this.userService.createUser(dto);
    }

    @ApiOperation({ summary: '내정보 조회', description: '내 정보를 조회합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req) {
        return req.user;
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: '전체 사용자 목록', description: '로그인 유저 제외' })
    getAllUsers(@Req() req) {
        return this.userService.getAllUsers(req.user.userId);
    }
}
