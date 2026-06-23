import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

const invalidRefreshToken = new UnauthorizedException("invalidRefreshToken");

export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor() {
    super();
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err || !user) {
      throw invalidRefreshToken;
    }

    return user;
  }
}
