import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UpdateUserInput, UserRole } from "src/graphql";

export class UpdateUserDto implements UpdateUserInput {
  @IsString()
  @IsNotEmpty({ message: "userIdIsRequired" })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: "departmentIdIsRequired" })
  departmentId: string;

  @IsString()
  @IsNotEmpty({ message: "positionIdIsRequired" })
  positionId: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: "roleIsRequired" })
  role: UserRole;
}
