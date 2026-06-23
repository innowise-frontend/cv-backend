import { IsString, IsNotEmpty, Length } from "class-validator";
import { VerifyMailInput } from "src/graphql";

export class VerifyMailDto implements VerifyMailInput {
  @IsString()
  @IsNotEmpty({ message: "otpIsRequired" })
  @Length(6, 6, { message: "shouldBe6Digits" })
  otp: string;
}
