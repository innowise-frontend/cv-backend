import { IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { ExportPdfInput, MarginInput } from "src/graphql";

export class ExportPdfDto implements ExportPdfInput {
  @IsString()
  @IsNotEmpty({ message: "htmlIsRequired" })
  html: string;

  @IsObject()
  @IsOptional()
  margin: MarginInput;
}
