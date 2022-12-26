import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  createToken(payload: any) {
    if (payload.password) delete payload.password;
    return this.jwtService.sign(payload);
  }
  verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
