import { MinLength } from "class-validator";
import { ChangePasswordInput } from "src/graphql";

export class ChangePasswordDto implements ChangePasswordInput {
  @MinLength(6)
  oldPassword: string;

  @MinLength(6)
  newPassword: string;

  @MinLength(6)
  confirmPassword: string;
}
