import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to inject current user into controller methods
 * Extracts user from JWT payload in request
 * Usage: @CurrentUser() user: any
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
