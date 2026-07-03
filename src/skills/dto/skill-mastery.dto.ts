import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { SkillMasteryInput, Mastery } from "src/graphql";

const MASTERIES = ["Novice", "Advanced", "Competent", "Proficient", "Expert"];

export class SkillMasteryDto implements SkillMasteryInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsIn(MASTERIES)
  mastery: Mastery;
}
