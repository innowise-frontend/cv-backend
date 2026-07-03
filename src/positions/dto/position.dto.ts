import { IsNotEmpty, IsString } from "class-validator";
import { CreatePositionInput, DeletePositionInput, UpdatePositionInput } from "src/graphql";

export class CreatePositionDto implements CreatePositionInput {
  @IsString()
  @IsNotEmpty({ message: "nameIsRequired" })
  name: string;
}

export class UpdatePositionDto extends CreatePositionDto implements UpdatePositionInput {
  @IsString()
  @IsNotEmpty({ message: "positionIdIsRequired" })
  positionId: string;
}

export class DeletePositionDto implements DeletePositionInput {
  @IsString()
  @IsNotEmpty({ message: "positionIdIsRequired" })
  positionId: string;
}
