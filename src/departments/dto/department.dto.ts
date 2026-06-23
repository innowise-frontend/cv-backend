import { IsNotEmpty, IsString } from "class-validator";
import { CreateDepartmentInput, DeleteDepartmentInput, UpdateDepartmentInput } from "src/graphql";

export class CreateDepartmentDto implements CreateDepartmentInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;
}

export class UpdateDepartmentDto extends CreateDepartmentDto implements UpdateDepartmentInput {
  @IsString()
  @IsNotEmpty({ message: "departmentIdIsRequired" })
  departmentId: string;
}

export class DeleteDepartmentDto implements DeleteDepartmentInput {
  @IsString()
  @IsNotEmpty({ message: "departmentIdIsRequired" })
  departmentId: string;
}
