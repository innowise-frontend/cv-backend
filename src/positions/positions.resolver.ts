import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/app/guards/roles.decorator";
import { SearchPaginationInput, UserRole } from "src/graphql";
import { PositionsService } from "./positions.service";
import { CreatePositionDto, UpdatePositionDto, DeletePositionDto } from "./dto/position.dto";

@Resolver()
export class PositionsResolver {
  constructor(private readonly positionsService: PositionsService) {}

  @Query("positions")
  positions(@Args("params", { nullable: true }) params?: SearchPaginationInput) {
    return this.positionsService.findAll(params);
  }

  @Roles(UserRole.Admin)
  @Mutation("createPosition")
  createPosition(@Args("position") args: CreatePositionDto) {
    return this.positionsService.create(args);
  }

  @Roles(UserRole.Admin)
  @Mutation("updatePosition")
  updatePosition(@Args("position") args: UpdatePositionDto) {
    return this.positionsService.update(args);
  }

  @Roles(UserRole.Admin)
  @Mutation("deletePosition")
  deletePosition(@Args("position") args: DeletePositionDto) {
    return this.positionsService.delete(args);
  }
}
