import { PartialType } from "@nestjs/mapped-types";
import { CreateCustomerDTO } from "./CreateCustomerDTO";

export class UpdateCustomerDTO extends PartialType(CreateCustomerDTO) { };