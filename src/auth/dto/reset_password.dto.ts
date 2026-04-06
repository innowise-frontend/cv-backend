import { MinLength } from "class-validator";
import { ResetPasswordInput } from "src/graphql";

export class ResetPasswordDto implements ResetPasswordInput {
  @MinLength(6)
  oldPassword: string;

  @MinLength(6)
  newPassword: string;

  @MinLength(6)
  confirmPassword: string;
}
