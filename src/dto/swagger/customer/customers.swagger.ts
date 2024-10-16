import { ApiProperty } from "@nestjs/swagger";

export class CustomerSwagger {

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
    updatedAt: string;

    @ApiProperty()
    subscriptionStatusId: string;

    @ApiProperty()
    planId: string;
    
    @ApiProperty()
    adminId: string;
}