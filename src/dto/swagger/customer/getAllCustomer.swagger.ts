import { ApiProperty } from "@nestjs/swagger";

export class CustomersSwaggerAll {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    telephone: number;

    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    plan: {
        name: string,
        price: number
    };

}