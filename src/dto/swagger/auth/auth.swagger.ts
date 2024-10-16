import { RegisterDTO } from "../../admin/RegisterDto";
import { OmitType } from '@nestjs/swagger'

export class AuthSwagger extends OmitType(RegisterDTO, ['codigoAutorizacao', 'password']) { }