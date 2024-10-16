import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PlanCreateDTO } from '../dto/plan/PlanCreateDTO';
import { PlanUpdateDTO } from '../dto/plan/PlanUpdateDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createPlan: PlanCreateDTO) {

        const existingPlan = await this.prismaService.plan.findUnique({
            where: { name: createPlan.name }
        })

        if (existingPlan) {
            throw new BadRequestException("Name already in use");
        }

        const newPlan = await this.prismaService.plan.create({
            data: {
                name: createPlan.name,
                price: createPlan.price,
                description: createPlan.description,
                adminId: createPlan.adminId
            }
        })

        return newPlan;
    }

    async getAll() {
        return this.prismaService.plan.findMany();
    }

    async update(id: string, updatePlan: PlanUpdateDTO) {
        const updatedPlan = await this.prismaService.plan.update({
            where: { id },
            data: updatePlan
        })

        if (!updatedPlan) {
            throw new BadRequestException("ID is required!");
        }

        return updatedPlan;
    }

    async getById(id: string) {
        const getById = await this.prismaService.plan.findUnique({
            where: { id }
        })

        if (!getById) {
            throw new BadRequestException("ID is required!");
        }

        return getById;
    }

    async delete(id: string) {
        if (!id) {
            throw new BadRequestException("ID is required!");
        }

        const existingDelete = await this.prismaService.plan.findUnique({
            where: { id },
        });

        if (!existingDelete) {
            throw new NotFoundException(`ID not found`);
        }

        const deletePlan = await this.prismaService.plan.delete({
            where: { id },
        });

        return deletePlan;
    }
}
