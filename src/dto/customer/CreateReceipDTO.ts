import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsString } from "class-validator";

export class ReceiptDTO {

    @IsNumber()
    @ApiProperty()
    amount: number;

    @IsDate()
    @ApiProperty()
    paymentDate: Date;

    @IsString()
    @ApiProperty()
    customerName: string;

    @IsString()
    @ApiProperty()
    customerEmail: string;
}