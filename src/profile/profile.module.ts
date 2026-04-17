import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CloudModule } from "src/cloud/cloud.module";
import { UserModel } from "src/users/model/user.model";
import { ProfileModel } from "./model/profile.model";
import { ProfileResolver } from "./profile.resolver";
import { ProfileService } from "./profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProfileModel, UserModel]), CloudModule],
  providers: [ProfileResolver, ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
