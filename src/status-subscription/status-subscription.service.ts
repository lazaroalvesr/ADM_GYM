import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDTO } from '../dto/subscription/CreateSubscriptionDTO';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusSubscriptionService {
    constructor(private prismaService: PrismaService) { }

    async create(subscription: CreateSubscriptionDTO) {
        const response = await this.prismaService.subscriptionStatus.create({
            data: {
                name: subscription.name
            }
        })

        return response;
    }

    async getAll() {
        return await this.prismaService.subscriptionStatus.findMany()
    }
}
