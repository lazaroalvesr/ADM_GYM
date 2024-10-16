import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNumber, IsString } from "class-validator";

export class CreateCustomerDTO {

    @IsString()
    @ApiProperty()
    name: string

    @IsEmail()
    @ApiProperty()
    email: string

    @IsNumber()
    @ApiProperty()
    telephone: number

    @IsString()
    @ApiProperty()
    planId: string

    @Type(() => Date)
    @ApiProperty()
    @IsDate({ message: "startDate must be a Date instance" })
    startDate: Date;

    @Type(() => Date)
    @ApiProperty()
    @IsDate({ message: "endDate must be a Date instance" })
    endDate: Date;

    @IsString()
    @ApiProperty()
    subscriptionStatusId: string

    @IsString()
    @ApiProperty()
    adminId: string
}


export interface CreatedCustomer {
    id: string;
    updatedAt: Date;
    name: string;
    email: string;
    telephone: number;
    adminId: string;
    planId: string;
    startDate: Date;
    endDate: Date;
    subscriptionStatusId: string;
  }