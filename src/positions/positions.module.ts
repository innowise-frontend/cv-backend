import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PositionModel } from "./model/position.model";
import { PositionsResolver } from "./positions.resolver";
import { PositionsService } from "./positions.service";
import { UserModel } from "src/users/model/user.model";

@Module({
  imports: [TypeOrmModule.forFeature([PositionModel, UserModel])],
  providers: [PositionsResolver, PositionsService],
  exports: [PositionsService],
})
export class PositionsModule {}
