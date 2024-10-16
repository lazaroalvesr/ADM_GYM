import { Body, Controller, Delete, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAdminDTO } from '../dto/admin/LoginAdminDTO';
import { RegisterDTO } from '../dto/admin/RegisterDto';
import { Public } from '../lib/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateProfileDTO } from '../dto/admin/UpdateProfileDTO';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSwagger } from '../dto/swagger/auth/auth.swagger';
import { UpdateProfileSwagger } from '../dto/swagger/auth/UpdateProfile.swagger';
import { BadRequestSwagger } from '../dto/swagger/global/badreques.swagger';
import { DeleteProfileSwggaer } from '../dto/swagger/auth/DeleteProfisse.swagger';

@Controller('auth')
@ApiTags("Autenticação")
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @ApiOperation({ summary: 'Fazer login' })
    @ApiResponse({
        status: 201,
        description: "Login realizado com sucesso!",
        type: AuthSwagger,
    })
    @ApiResponse({
        status: 400,
        description: "Email ou senha incorretos!",
        type: BadRequestSwagger
    })
    @Public()
    async login(@Body() loginAdminData: LoginAdminDTO) {
        return this.authService.login(loginAdminData)
    }

    @Post("create")
    @ApiOperation({ summary: 'Criar conta: CODE7933', })
    @ApiResponse({
        status: 201,
        description: "Conta criada com sucesso!",
        type: AuthSwagger,
    })
    @ApiResponse({
        status: 400,
        description: "Email já em uso!",
        type: BadRequestSwagger
    })
    @Public()
    async create(@Body() CreateAdminData: RegisterDTO) {
        return this.authService.register(CreateAdminData);
    }

    @Put('profile/:id')
    @ApiOperation({ summary: 'Atualizar perfil e fazer upload da imagem de perfil' })
    @ApiResponse({
        status: 200,
        description: "Dados e img atualizados com sucesso!",
        type: UpdateProfileSwagger,
    })
    @ApiResponse({
        status:
            400,
        description: "Parâmetro desconhecido!",
        type: BadRequestSwagger
    })
    @ApiBody({
        description: 'Dados do perfil a serem atualizados',
        type: UpdateProfileSwagger,
        examples: {
            example1: {
                summary: 'Exemplo de atualização de perfil',
                value: {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    profileImage: "FormData"
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('profileImage'))
    async updateProfile(
        @Param('id') userId: string,
        @Body() updateProfileDto: UpdateProfileDTO,
        @UploadedFile() profileImage: Express.Multer.File
    ) {
        return this.authService.updateProfile(userId, updateProfileDto, profileImage);
    }

    @Delete("delete/:id")
    @ApiOperation({ summary: 'Remover conta do ADM', })
    @ApiResponse({
        status: 201,
        description: "Conta criada com sucesso!",
        type: DeleteProfileSwggaer,
    })
    @ApiResponse({
        status: 400,
        description: "Erro ao remover ADM!",
        type: BadRequestSwagger
    })
    async deleteProfile(@Param("id") id: string) {
        return await this.authService.deleteProfile(id)
    }
}
