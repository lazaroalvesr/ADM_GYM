import { ApiProperty } from '@nestjs/swagger'

export class UpdateProfileSwagger {

    @ApiProperty()
    nome: string

    @ApiProperty()
    email: string

    @ApiProperty()
    profileImage: string
}