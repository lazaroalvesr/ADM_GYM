import { ApiProperty } from '@nestjs/swagger';

export class ByEmailCustomer {

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
    updatedAt: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    subscriptionStatusId: string;

    @ApiProperty()
    plan: Plan;

    @ApiProperty()
    adminId: string; 

    @ApiProperty()
    Receipt: Receipt;
}

export interface Receipt {
}

export interface Plan {

    name: string
    price: number
}