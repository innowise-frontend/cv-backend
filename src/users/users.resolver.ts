import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ForbiddenException, UseGuards } from "@nestjs/common";
import { Roles } from "src/app/guards/roles.decorator";
import { OwnUserGuard } from "src/app/guards/own-user.guard";
import { GetUserId } from "src/app/decorators/get_user_id.decorator";
import { SearchPaginationInput, UserRole } from "src/graphql";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query("users")
  users(@Args("params", { nullable: true }) params?: SearchPaginationInput) {
    return this.usersService.findAll(params);
  }

  @Query("user")
  user(@Args("userId") userId: string) {
    return this.usersService.findOneById(userId);
  }

  @Mutation("changePassword")
  changePassword(@GetUserId() userId: string, @Args("args") args: ChangePasswordDto) {
    return this.usersService.changePassword(userId, args);
  }

  @Roles(UserRole.Admin)
  @Mutation("createUser")
  createUser(@Args("user") args: CreateUserDto) {
    return this.usersService.createUser(args);
  }

  @UseGuards(OwnUserGuard)
  @Mutation("updateUser")
  updateUser(@Args("user") args: UpdateUserDto) {
    return this.usersService.updateUser(args);
  }

  @Roles(UserRole.Admin)
  @Mutation("deleteUser")
  async deleteUser(@Args("userId") userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (user.is_verified) {
      throw new ForbiddenException("You cannot delete a verified User");
    }
    return this.usersService.deleteUser(userId);
  }
}
