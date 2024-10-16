import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReceiptCreate } from '../dto/receipt/createReceipt.dtp';
import { Response } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReceiptSwagger } from '../dto/swagger/receipt/Receipt;swagger';
import { BadRequestSwagger } from '../dto/swagger/global/badreques.swagger';
import { GetAllReceiptSwagger } from '../dto/swagger/receipt/GetAllReceipt;swagger copy';

@UseGuards(JwtAuthGuard)
@ApiTags("Recibo")
@Controller('receipt')
export class ReceiptController {
    constructor(private receiptService: ReceiptService) { }

    @Post("create")
    @ApiOperation({ summary: 'Criar um recibo' })
    @ApiResponse({
        status: 201,
        description: "Recibo criado com sucesso!",
        type: ReceiptSwagger
    })
    @ApiResponse({
        status: 400,
        description: "Erro ai gerar recibo!",
        type: BadRequestSwagger
    })
    create(@Body() createReceipt: ReceiptCreate) {
        return this.receiptService.create(createReceipt)
    }

    @Get("getByEmail/:email")
    @ApiOperation({ summary: 'Exibir informações de um recibo' })
    @ApiResponse({
        status: 201,
        description: "Exibir todos os recibos criados!",
        type: [GetAllReceiptSwagger]
    })
    @ApiResponse({
        status: 400,
        description: "Erro ai exibir os recibos!",
        type: BadRequestSwagger
    })
    async getByEmail(@Param("email") email: string) {
        return await this.receiptService.getByEmail(email);
    }


    @Get(':id')
    @ApiOperation({ summary: 'Gerar o PDF do recibo' })
    @ApiResponse({
        status: 201,
        description: 'PDF do recibo gerado com sucesso',
    })
    @ApiResponse({
        status: 400,
        description: 'Erro ao gerar o PDF do recibo',
        type: BadRequestSwagger
    })
    async generatePdf(@Param('id') id: string, @Res() res: Response) {
        try {
            const filePath = await this.receiptService.generateReceiptPDF(id);

            res.download(filePath, (err) => {
                if (err) {
                    console.error("Error downloading file:", err);
                    res.status(500).send("Could not download the file.");
                }
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            res.status(500).send("Could not generate the PDF.");
        }
    }
}
