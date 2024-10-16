import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanCreateDTO } from '../dto/plan/PlanCreateDTO';
import { PlanUpdateDTO } from '../dto/plan/PlanUpdateDTO';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../dto/swagger/global/badreques.swagger';
import { PlanCreateSwagger } from '../dto/swagger/plan/PlanCreate.swagger';
import { GetAllPlan } from '../dto/swagger/plan/GetAllPlan.swagger';
import { UpdatePlanSwagger } from '../dto/swagger/plan/UpdatePlan.swagger';

@UseGuards(JwtAuthGuard)
@Controller("plan")
@ApiTags("Plano")
export class PlanController {
    constructor(private planService: PlanService) { }

    @Post("create")
    @ApiOperation({ summary: 'Criar plano' })
    @ApiResponse({
        status: 201,
        description: "Plano criado com sucesso!",
        type: PlanCreateSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao criar plano!",
        type: BadRequestSwagger
    })
    create(@Body() createPlan: PlanCreateDTO) {
        return this.planService.create(createPlan);
    }

    @Get("getAll")
    @ApiOperation({ summary: 'Buscar todos os planos' })
    @ApiResponse({
        status: 201,
        description: "Exibir todos os planos!",
        type: [GetAllPlan]
    })
    @ApiResponse({
        status: 400,
        description: "Erro exibir os planos!",
        type: BadRequestSwagger
    })
    getAll() {
        return this.planService.getAll()
    }

    @Patch(":id")
    @ApiOperation({ summary: 'Atualizar informações de um plano' })
    @ApiResponse({
        status: 201,
        description: "Plano atualizado com sucesso!",
        type: PlanCreateSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao atualizar plano!",
        type: BadRequestSwagger
    })
    @ApiBody({
        description: 'Dados do plano a serem atualizados',
        type: UpdatePlanSwagger,
        examples: {
            example1: {
                summary: 'Exemplo de atualização de de plano',
                value: {
                    name: 'Plano Familia',
                    price: 120
                },
            },
        },
    })
    update(@Body() updatePlan: PlanUpdateDTO, @Param("id") id: string) {
        return this.planService.update(id, updatePlan);
    }

    @Get("getById/:id")
    @ApiResponse({
        status: 201,
        description: "Exibir um plano!",
        type: PlanCreateSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir plano!",
        type: BadRequestSwagger
    })
    @ApiOperation({ summary: 'Exibir informações de um plano' })
    getById(@Param("id") id: string) {
        return this.planService.getById(id)
    }

    @Delete(":id")
    @ApiOperation({ summary: 'Remover um plano' })
    @ApiResponse({
        status: 201,
        description: "Plano removido com sucesso!",
        type: PlanCreateSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao exibir o remover plano. Parâmetros inválidos ou dados incompletos!",
        type: BadRequestSwagger
    })
    delete(@Param("id") id: string) {
        return this.planService.delete(id);
    }
}
