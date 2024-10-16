import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
import { ReceiptCreate } from '../dto/receipt/createReceipt.dtp';
import { formatDate } from '../lib/formated';

@Injectable()
export class ReceiptService {
    constructor(private readonly prismaService: PrismaService) { }

    async create(createReceipt: ReceiptCreate) {
        const createdReceipt = await this.prismaService.receipt.create({
            data: {
                name: createReceipt.name,
                email: createReceipt.email,
                paymentDate: createReceipt.paymentDate,
                dueDate: createReceipt.dueDate,
                value: createReceipt.value,
                adminId: createReceipt.adminId
            },
        });

        return createdReceipt;
    }

    async getByEmail(email: string) {

        const response = await this.prismaService.receipt.findMany({
            where: {
                email: {
                    equals: email,
                    mode: 'insensitive'
                }
            },
            select: {
                name: true,
                email: true,
                dueDate: true,
                paymentDate: true,
                value: true
            }
        });


        return response;
    }
    async generateReceiptPDF(id: string): Promise<string> {
        const existingUser = await this.prismaService.receipt.findUnique({
            where: { id },
            include: {
                admin: true
            }
        });

        if (!existingUser || !existingUser.admin) {
            throw new Error("Receipt or admin not found.");
        }

        const pdfDirectory = path.join(__dirname, '..', '..', 'pdf');

        if (!fs.existsSync(pdfDirectory)) {
            fs.mkdirSync(pdfDirectory, { recursive: true });
        }

        const clientName = existingUser.name.replace(/[^a-zA-Z0-9]/g, '_');
        const timestamp = Date.now();
        const filePath = path.join(pdfDirectory, `${clientName}_${timestamp}.pdf`);

        const doc = new PDFDocument({
            size: "LETTER",
            bufferPages: true
        });

        doc.moveDown(1.5);

        // Format the dates
        const dueDate: string = formatDate(existingUser.dueDate);
        const datePayment: string = formatDate(existingUser.paymentDate, true);

        doc.fontSize(18).text('RECIBO DE PAGAMENTO', { align: 'center' });
        doc.moveDown(0.5);

        const currentDateTime = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        doc.fontSize(12).text(`${currentDateTime} (Horário de Brasília) `, { align: 'center' });
        doc.moveDown(1);

        // PDF content
        doc.fontSize(12).font('Helvetica-Bold').text(`Vencimento: `, { continued: true });
        doc.fontSize(12).font('Helvetica').text(`${dueDate}`, { align: 'left' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text(`Data do pagamento: `, { continued: true });
        doc.fontSize(12).font('Helvetica').text(`${datePayment} (Horário de Brasília)`, { align: 'left' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text(`Valor: `, { continued: true });
        doc.fontSize(12).font('Helvetica').text(` R$ ${existingUser.value.toFixed(2)}`, { align: 'left' });
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text(`Pagador: `, { continued: true });
        doc.fontSize(12).font('Helvetica').text(`${existingUser.name}`);
        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text(`Email: `, { continued: true });
        doc.fontSize(12).font('Helvetica').text(`${existingUser.email}`);
        doc.moveDown();

        // Finish the PDF generation
        const buffer: Buffer[] = [];
        doc.on('data', (chunk) => buffer.push(chunk));
        doc.on('end', async () => {
            const data = Buffer.concat(buffer);
            fs.writeFileSync(filePath, data);
        });

        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);
        doc.end();

        return new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                resolve(filePath);
            });
            writeStream.on('error', (error) => {
                reject(error);
            });
        });
    }
}

