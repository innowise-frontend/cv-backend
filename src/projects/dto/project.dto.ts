import { Type } from "class-transformer";
import { IsArray, IsISO8601, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateProjectInput, UpdateProjectInput, DeleteProjectInput } from "src/graphql";

export class CreateProjectDto implements CreateProjectInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty({ message: "domainIsRequired" })
  domain: string;

  @IsISO8601()
  @IsNotEmpty({ message: "startDateIsRequired" })
  start_date: string;

  @IsISO8601()
  @IsOptional()
  @IsNotEmpty({ message: "endDateIsRequired" })
  end_date: string;

  @IsArray()
  @Type(() => String)
  environment: string[];
}

export class UpdateProjectDto extends CreateProjectDto implements UpdateProjectInput {
  @IsString()
  @IsNotEmpty({ message: "projectIdIsRequired" })
  projectId: string;
}

export class DeleteProjectDto implements DeleteProjectInput {
  @IsString()
  @IsNotEmpty({ message: "projectIdIsRequired" })
  projectId: string;
}
