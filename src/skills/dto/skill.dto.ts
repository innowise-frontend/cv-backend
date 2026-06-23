import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateSkillInput, UpdateSkillInput, DeleteSkillInput } from "src/graphql";

export class CreateSkillDto implements CreateSkillInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;

  @IsString()
  @IsOptional()
  categoryId: string;
}

export class UpdateSkillDto extends CreateSkillDto implements UpdateSkillInput {
  @IsString()
  @IsNotEmpty({ message: "skillIdIsRequired" })
  skillId: string;
}

export class DeleteSkillDto implements DeleteSkillInput {
  @IsString()
  @IsNotEmpty({ message: "skillIdIsRequired" })
  skillId: string;
}
