import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PlanModule } from './plan/plan.module';
import { CustomerModule } from './customer/customer.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StatusSubscriptionModule } from './status-subscription/status-subscription.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ReceiptModule } from './receipt/receipt.module';

@Module({
  imports: [PrismaModule, AuthModule,
    ConfigModule.forRoot({
      isGlobal: true
    }), PlanModule,
    CustomerModule, ScheduleModule.forRoot(), StatusSubscriptionModule, ReceiptModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: JwtAuthGuard
  }],
})
export class AppModule { }
