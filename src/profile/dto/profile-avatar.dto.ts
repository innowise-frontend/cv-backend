import { IsIn, IsInt, IsNotEmpty, IsString, Max } from "class-validator";
import { DeleteAvatarInput, UploadAvatarInput } from "src/graphql";

export class UploadAvatarDto implements UploadAvatarInput {
  @IsString()
  @IsNotEmpty({ message: "userIdIsRequired" })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: "base64IsRequired" })
  base64: string;

  @IsInt()
  @Max(500_000)
  @IsNotEmpty({ message: "sizeIsRequired" })
  size: number;

  @IsString()
  @IsIn(["image/jpeg", "image/png", "image/gif", "image/svg+xml"])
  @IsNotEmpty({ message: "typeIsRequired" })
  type: string;
}

export class DeleteAvatarDto implements DeleteAvatarInput {
  @IsString()
  @IsNotEmpty({ message: "userIdIsRequired" })
  userId: string;
}
