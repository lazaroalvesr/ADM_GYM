import { ApiProperty } from "@nestjs/swagger";

export class DeleteProfileSwggaer {

    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    profileImage?: string | null;

    @ApiProperty()
    password: string;
}