import { IsEmail, MinLength } from "class-validator";
import { AuthInput } from "src/graphql";

export class SignupDto implements AuthInput {
  @IsEmail({}, { message: "invalidEmail" })
  email: string;

  @MinLength(5, { message: "passwordTooShort" })
  password: string;

  @MinLength(5, { message: "confirmPasswordTooShort" })
  confirmPassword: string;
}
