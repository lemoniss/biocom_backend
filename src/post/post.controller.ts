import { Controller, Post, Get, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostDto } from './post.dto';

@ApiTags('Post')
@Controller('posts')
export class PostController {
    constructor(private postService: PostService) { }

    @ApiOperation({ summary: '게시물 작성', description: '게시물 내용을 입력하여 새 글을 등록합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: PostDto, @Req() req) {
        return this.postService.create(req.user.userId, dto.content, dto.imageUrl);
    }

    @ApiOperation({ summary: '게시물 전체검색', description: '게시물을 전체 검색합니다.' })
    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @ApiOperation({ summary: '게시물 상세검색', description: '특정 게시물의 상세내용을 검색합니다.' })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.postService.findOne(Number(id)); 
    }

    @ApiOperation({ summary: '게시물 수정', description: '특정 게시물의 내용을 수정합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: PostDto) {
        return this.postService.update(Number(id), dto.content, dto.imageUrl);
    }

    @ApiOperation({ summary: '게시물 삭제', description: '게시물을 삭제합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.postService.delete(Number(id));
    }
}
