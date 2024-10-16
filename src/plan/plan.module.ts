import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PlanService, PrismaService],
  controllers: [PlanController]
})
export class PlanModule {}
