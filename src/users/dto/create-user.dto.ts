import { IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateUserInput, UserRole } from "src/graphql";
import { SignupDto } from "src/auth/dto/signup.dto";
import { CreateProfileDto } from "src/profile/dto/profile.dto";

export class CreateUserDto implements CreateUserInput {
  @IsObject()
  @Type(() => SignupDto)
  @IsNotEmpty({ message: "authIsRequired" })  
  auth: SignupDto;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: "roleIsRequired" })
  role: UserRole;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  @IsNotEmpty({ message: "profileIsRequired" })
  profile: CreateProfileDto;

  @IsString()
  @IsNotEmpty({ message: "departmentIdIsRequired" })
  departmentId: string;

  @IsString()
  @IsNotEmpty({ message: "positionIdIsRequired" })
  positionId: string;
}
