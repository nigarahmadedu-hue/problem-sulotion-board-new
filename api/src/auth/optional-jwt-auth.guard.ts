import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * OptionalJwtAuthGuard — like JwtAuthGuard but never throws on missing/invalid token.
 * If a valid Bearer token is present, it attaches req.user. Otherwise req.user stays null.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override so passport doesn't throw 401 when no token is provided
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}
