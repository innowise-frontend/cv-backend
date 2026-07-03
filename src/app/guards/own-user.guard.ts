import { ForbiddenException, Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtPayload } from "src/auth/strategies/access_token.strategy";
import { UserRole } from "src/graphql";

const cannotAssignAdminRoleToYourself = new ForbiddenException("cannotAssignAdminRoleToYourself");
const notOwnUser = new ForbiddenException("notOwnUser");

@Injectable()
export class OwnUserGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const jwt = req.user as JwtPayload;

    const args = context.getArgByIndex(1);
    const userId = args.user.userId;
    const role = args.user.role;

    const isAdmin = jwt.role === UserRole.Admin;
    const isOwnUser = String(jwt.sub) === userId;

    if (isAdmin) {
      return true;
    }
    if (!isAdmin && isOwnUser && role === UserRole.Admin) {
      throw cannotAssignAdminRoleToYourself;
    }
    if (isOwnUser) {
      return true;
    }

    throw notOwnUser;
  }
}
