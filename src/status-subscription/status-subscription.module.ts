import { Module } from '@nestjs/common';
import { StatusSubscriptionController } from './status-subscription.controller';
import { StatusSubscriptionService } from './status-subscription.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StatusSubscriptionController],
  providers: [StatusSubscriptionService, PrismaService]
})
export class StatusSubscriptionModule {}
