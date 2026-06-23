import {
  ArgumentsHost,
  Catch,
  HttpException,
  InternalServerErrorException,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

@Catch()
export class AllExceptionsFilter implements GqlExceptionFilter {
  catch(exception: unknown, _host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return exception;
    }

    return new InternalServerErrorException("internalServerError");
  }
}
