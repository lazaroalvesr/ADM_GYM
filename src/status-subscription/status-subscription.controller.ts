import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StatusSubscriptionService } from './status-subscription.service';
import { CreateSubscriptionDTO } from '../dto/subscription/CreateSubscriptionDTO';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../dto/swagger/global/badreques.swagger';
import { SubscriptionSwagger } from '../dto/swagger/subscription/subscriptionCreate.swagger';

@UseGuards(JwtAuthGuard)
@Controller('status-subscription')
@ApiTags("Status da Assinatura")
export class StatusSubscriptionController {
    constructor(private subscriptionService: StatusSubscriptionService) { }

    @Post("create")
    @ApiOperation({ summary: 'Criar status' })
    @ApiResponse({
        status: 201,
        description: "Status de Assinatura criado com sucesso!",
        type: SubscriptionSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao criar status!",
        type: BadRequestSwagger
    })
    create(@Body() subscription: CreateSubscriptionDTO) {
        return this.subscriptionService.create(subscription);
    }

    @Get("getAll")
    @ApiOperation({ summary: 'Exibirt todos os status' })
    @ApiResponse({
        status: 201,
        description: "Exibir todos os status!",
        type: [SubscriptionSwagger]
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir todos os status!",
        type: BadRequestSwagger
    })
    getAll() {
        return this.subscriptionService.getAll()
    }
}
