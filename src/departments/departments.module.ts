import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentModel } from "./model/department.model";
import { DepartmentsResolver } from "./departments.resolver";
import { DepartmentsService } from "./departments.service";
import { UserModel } from "src/users/model/user.model";

@Module({
  imports: [TypeOrmModule.forFeature([DepartmentModel, UserModel])],
  providers: [DepartmentsResolver, DepartmentsService],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
