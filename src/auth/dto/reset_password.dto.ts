import { MinLength } from "class-validator";
import { ResetPasswordInput } from "src/graphql";

export class ResetPasswordDto implements ResetPasswordInput {
  @MinLength(6, { message: "passwordTooShort" })
  newPassword: string;

  @MinLength(6, { message: "confirmPasswordTooShort" })
  confirmPassword: string;
}
