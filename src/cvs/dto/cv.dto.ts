import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateCvInput, UpdateCvInput, DeleteCvInput } from "src/graphql";

export class CreateCvDto implements CreateCvInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;

  @IsString()
  @IsOptional()
  education: string;

  @IsString()
  @IsNotEmpty({ message: "descriptionIsRequired" })
  description: string;

  @IsString()
  @IsNotEmpty({ message: "userIdIsRequired" })
  @IsOptional()
  userId: string;
}

export class UpdateCvDto implements UpdateCvInput {
  @IsString()
  @IsNotEmpty({ message: "cvIdIsRequired" })
  cvId: string;

  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;

  @IsString()
  @IsOptional()
  education: string;

  @IsString()
  @IsNotEmpty({ message: "descriptionIsRequired" })
  description: string;
}

export class DeleteCvDto implements DeleteCvInput {
  @IsString()
  @IsNotEmpty({ message: "cvIdIsRequired" })
  cvId: string;
}
