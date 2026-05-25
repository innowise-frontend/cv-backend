import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/app/guards/roles.decorator";
import { SearchPaginationInput, UserRole } from "src/graphql";
import { DepartmentsService } from "./departments.service";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DeleteDepartmentDto,
} from "./dto/department.dto";

@Resolver()
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Query("departments")
  departments(@Args("params", { nullable: true }) params?: SearchPaginationInput) {
    return this.departmentsService.findAll(params);
  }

  @Roles(UserRole.Admin)
  @Mutation("createDepartment")
  createDepartment(@Args("department") args: CreateDepartmentDto) {
    return this.departmentsService.create(args);
  }

  @Roles(UserRole.Admin)
  @Mutation("updateDepartment")
  updateDepartment(@Args("department") args: UpdateDepartmentDto) {
    return this.departmentsService.update(args);
  }

  @Roles(UserRole.Admin)
  @Mutation("deleteDepartment")
  deleteDepartment(@Args("department") args: DeleteDepartmentDto) {
    return this.departmentsService.delete(args);
  }
}
