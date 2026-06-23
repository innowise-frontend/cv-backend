import { IsNotEmpty, MinLength } from "class-validator";
import { ChangePasswordInput } from "src/graphql";

export class ChangePasswordDto implements ChangePasswordInput {
  @MinLength(6, { message: "oldPasswordTooShort" })
  @IsNotEmpty({ message: "oldPasswordIsRequired" })
  oldPassword: string;

  @MinLength(6, { message: "newPasswordTooShort" })
  @IsNotEmpty({ message: "newPasswordIsRequired" })
  newPassword: string;

  @MinLength(6, { message: "confirmPasswordTooShort" })
  @IsNotEmpty({ message: "confirmPasswordIsRequired" })
  confirmPassword: string;
}
