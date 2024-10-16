import { ApiProperty } from "@nestjs/swagger";

export class GetAllReceiptSwagger {

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    paymentDate: string;
    @ApiProperty()

    dueDate: string;
    @ApiProperty()

    @ApiProperty()
    value: number;
}