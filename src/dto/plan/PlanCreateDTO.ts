import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator"

export class PlanCreateDTO {

    @IsString()
    @ApiProperty()
    name: string

    @IsNumber()
    @ApiProperty()
    price: number

    @ApiProperty()
    @IsString()
    description: string;

    @IsString()
    @ApiProperty()
    adminId: string;
}