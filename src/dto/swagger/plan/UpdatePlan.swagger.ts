import { ApiProperty } from "@nestjs/swagger";

export class UpdatePlanSwagger {

    @ApiProperty()
    name: string

    @ApiProperty()
    price: number
}