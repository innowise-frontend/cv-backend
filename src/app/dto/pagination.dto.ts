import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min, IsIn, IsString } from "class-validator";

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(["ASC", "DESC"], { message: "invalidSortOrder" })
  @IsString()
  sort_order?: "ASC" | "DESC";

  @IsOptional()
  @IsString()
  sort_by?: string;
}
