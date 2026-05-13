import { IsEnum, IsOptional, IsString } from "class-validator";
import { UpdateUserInput } from "src/graphql";
import { UserRole } from "src/graphql";

export class UpdateUserDto implements UpdateUserInput {
  @IsString()
  userId: string;

  @IsString()
  departmentId: string;

  @IsString()
  positionId: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
}
