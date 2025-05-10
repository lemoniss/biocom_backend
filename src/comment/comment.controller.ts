import { Controller, Post, Body, Param, Patch, Delete, UseGuards, Req, Get } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
    constructor(private commentService: CommentService) { }

    @ApiOperation({ summary: '댓글 작성', description: '게시물에 댓글을 작성합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CommentDto, @Req() req) {
        return this.commentService.create(req.user.userId, dto);
    }

    @ApiOperation({ summary: '댓글 조회', description: '게시물의 댓글을 조회합니다.' })
    @Get('post/:postId')
    findByPost(@Param('postId') postId: string) {
        return this.commentService.findByPost(Number(postId));
    }

    @ApiOperation({ summary: '댓글 수정', description: '작성한 댓글 내용을 수정합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: CommentDto) {
        return this.commentService.update(Number(id), dto);
    }

    @ApiOperation({ summary: '댓글 삭제', description: '게시물의 댓글을 삭제합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.commentService.delete(Number(id));
    }
}
