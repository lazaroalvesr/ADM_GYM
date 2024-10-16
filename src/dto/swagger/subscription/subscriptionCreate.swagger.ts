import { ApiProperty } from "@nestjs/swagger";

export class SubscriptionSwagger {

    @ApiProperty()
    id: string

    @ApiProperty()
    name: string
}