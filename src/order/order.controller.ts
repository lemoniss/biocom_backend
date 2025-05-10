import { Controller, Post, UseGuards, Req, Get, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './order.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @ApiOperation({summary: '주문 생성',description: '장바구니 기반으로 주문을 생성하고, 결제를 시뮬레이션 처리합니다.',})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() dto: CreateOrderDto, @Req() req) {
        return this.orderService.create(req.user.userId);
    }

    @ApiOperation({summary: '주문 조회',description: '내 주문내역을 조회합니다.',})
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get()
    findMyOrders(@Req() req) {
        return this.orderService.findMyOrders(req.user.userId);
    }
}
