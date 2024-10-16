import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDTO } from '../dto/admin/RegisterDto';
import { LoginAdminDTO } from '../dto/admin/LoginAdminDTO';
import { UpdateProfileDTO } from 'src/dto/admin/UpdateProfileDTO';
import { supabase } from '../supabaseClient';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private readonly prismaService: PrismaService
    ) { }

    async login({ email, password }: LoginAdminDTO) {
        try {
            const user = await this.prismaService.admin.findFirst({
                where: { email },
            });

            if (!user) {
                throw new BadRequestException('Email ou senha inválido.');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                throw new BadRequestException('Email ou senha estão inválidos!');
            }

            const { password: _, ...userSemSenha } = user;
            const payload = { ...userSemSenha };
            const access_token = await this.jwtService.signAsync(payload);

            return { user: payload, access_token };
        } catch (error) {
            throw new BadRequestException('Erro ao fazer Login!');
        }
    }

    async register({ name, email, password, codigoAutorizacao }: RegisterDTO) {
        const validAuthorizationCode = "CODE7933";

        if (codigoAutorizacao !== validAuthorizationCode) {
            throw new BadRequestException('Invalid authorization code.');
        }

        const existingAdmin = await this.prismaService.admin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            throw new BadRequestException('Email já em uso!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await this.prismaService.admin.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...adminWithoutPassword } = admin;

        const accessToken = await this.jwtService.signAsync(adminWithoutPassword);

        return { admin: adminWithoutPassword, access_token: accessToken };
    }

    async updateProfile(
        userId: string,
        updateData?: Partial<Omit<UpdateProfileDTO, 'profileImage'>>,
        profileImage?: Express.Multer.File
    ) {
        const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
        let profileImageUrl: string | undefined;

        if (profileImage) {
            if (profileImage.size > MAX_IMAGE_SIZE) {
                throw new BadRequestException('Profile image size must not exceed 10 MB.');
            }

            const uploadResponse = await this.uploadProfileImage(userId, profileImage);

            if (typeof uploadResponse === 'object' && 'error' in uploadResponse) {
                throw new BadRequestException('Error uploading profile image.');
            }

            profileImageUrl = uploadResponse;
        }

        const updatePayload: any = {
            ...updateData,
            profileImage: profileImageUrl || undefined,
        };

        const updatedAdmin = await this.prismaService.admin.update({
            where: { id: userId },
            data: updatePayload,
        });

        const { password: _, ...adminWithoutPassword } = updatedAdmin;

        return { admin: adminWithoutPassword };
    }

    async deleteProfile(id: string) {
        const resoponse = await this.prismaService.admin.delete({
            where: { id }
        })

        return resoponse
    }

    private async uploadProfileImage(id: string, profileImage: Express.Multer.File) {
        const user = await this.prismaService.admin.findFirst({
            where: { id }
        })

        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('manage_img')
            .upload(`public/${user.id}/profile.png`, profileImage.buffer, {
                contentType: profileImage.mimetype,
                upsert: true,
            });

        if (uploadError) {
            return { error: uploadError };
        }

        const { data } = supabase
            .storage
            .from('profile-images')
            .getPublicUrl(`public/${user.id}/profile.png`);

        return data.publicUrl
    }

}
