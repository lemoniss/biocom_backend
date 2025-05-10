import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
    @ApiProperty({ description: '게시물 식별자', example: '1' })
    postId: number;

    @ApiProperty({ description: '댓글 내용', example: '좋은 글이네요!' })
    content: string;
}
