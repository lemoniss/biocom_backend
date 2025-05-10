import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Like')
@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @ApiOperation({ summary: '좋아요 추가/제거 토글', description: '게시물에 좋아요 추가 또는 제거를 할 수 있습니다.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  toggle(@Body() dto: { postId: number }, @Req() req) {
    return this.likeService.toggleLike(req.user.userId, dto.postId);
  }

  @ApiOperation({ summary: '좋아요 카운트 조회', description: '게시물에 좋아요 횟수를 조회할 수 있습니다.' })
  @Get('count/:postId')
  count(@Param('postId') postId: string) {
    return this.likeService.count(Number(postId));
  }
}
