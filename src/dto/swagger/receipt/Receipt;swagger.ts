import { ApiProperty } from "@nestjs/swagger";

export class ReceiptSwagger {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;
    
    @ApiProperty()
    paymentDate: string;

    @ApiProperty()
    dueDate: string;

    @ApiProperty()
    
    @ApiProperty()
    value: number;

    @ApiProperty()
    adminId: string;
}