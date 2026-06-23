import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { AuthInput } from "src/graphql";

export class LoginDto implements AuthInput {
  @IsEmail({}, { message: "invalidEmail" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "passwordIsRequired" })
  password: string;
}
