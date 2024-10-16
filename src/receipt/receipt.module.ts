import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService, PrismaService]
})
export class ReceiptModule {}
