import { ApiProperty } from "@nestjs/swagger";

export class GetAllPlan {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    price: number;

    @ApiProperty()
    adminId: string;
}