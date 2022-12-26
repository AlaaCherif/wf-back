import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Observable } from 'rxjs';
import { TokenService } from 'src/user/token/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenService: TokenService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const header = request.headers;
    if (!header.authorization) throw new UnauthorizedException('No token');
    const token = header.authorization.split(' ')[1];
    if (!token) throw new UnauthorizedException('Token Invalid');
    try {
      this.tokenService.verifyToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
