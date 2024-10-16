import { PartialType } from "@nestjs/mapped-types";
import { PlanCreateDTO } from "./PlanCreateDTO";

export class PlanUpdateDTO extends PartialType(PlanCreateDTO){};