import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@api/auth/types/user-payload';

/**
 * JWT Strategy for Passport authentication
 * Validates JWT tokens in incoming requests
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validate and return user payload from JWT
   * This method is called after JWT signature is verified
   * @param payload - Decoded JWT payload
   * @returns User data from payload
   */
  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
    };
  }
}
