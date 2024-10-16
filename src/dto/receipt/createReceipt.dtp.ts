import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator"

export class ReceiptCreate {

    @IsString()
    @ApiProperty()
    name: string

    @IsEmail()
    @ApiProperty()
    email: string

    @Type(() => Date)
    @ApiProperty()
    @IsDate({ message: "paymentDate must be a Date instance" })
    paymentDate: Date;

    @Type(() => Date)
    @ApiProperty()
    @IsDate({ message: "dueDate must be a Date instance" })
    dueDate: Date;

    @IsNumber()
    @ApiProperty()
    value: number

    @IsString()
    @ApiProperty()
    adminId: string
}