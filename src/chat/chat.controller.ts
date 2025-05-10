import { Controller, Get, UseGuards, Param, Req, Patch, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('messages')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @ApiOperation({ summary: '채팅메세지 가져오기', description: '채팅내용을 조회합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':targetUserId')
    async getChatMessages(@Param('targetUserId') targetUserId: string, @Req() req) {
        const targetId = Number(targetUserId);
        if (isNaN(targetId)) {
            throw new BadRequestException('유효하지 않은 사용자 ID입니다.');
        }
        return this.chatService.getMessagesBetween(req.user.userId, targetId);
    }

    @ApiOperation({ summary: '채팅메세지 읽음처리', description: '메세지를 읽음처리 업데이트 합니다.' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    async markAsRead(@Param('id') id: string, @Req() req) {
        return this.chatService.markMessageAsRead(req.user.userId, Number(id));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: '안 읽은 메시지 수 조회' })
    @UseGuards(JwtAuthGuard)
    @Get('unread/count')
    async getUnreadCounts(@Req() req) {
        return this.chatService.getUnreadCounts(req.user.userId);
    }
}
