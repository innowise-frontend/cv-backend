import { IsEnum, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserInput, UserRole } from "src/graphql";
import { SignupDto } from "src/auth/dto/signup.dto";
import { CreateProfileDto } from "src/profile/dto/profile.dto";

export class CreateUserDto implements CreateUserInput {
  @IsObject()
  @Type(() => SignupDto)
  auth: SignupDto;

  @IsEnum(UserRole)
  role: UserRole;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @IsString()
  departmentId: string;

  @IsString()
  positionId: string;
}
