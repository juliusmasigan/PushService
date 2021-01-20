import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    // super({
    //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //     ignoreExpiration: false,
    //     secretOrKey: jwtConstants.secret,
    // });
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${config.get('AUTH0_ISSUER_URL')}/.well-known/openid-configuration/jwks`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: config.get('AUTH0_AUDIENCE'),
      issuer: config.get('AUTH0_ISSUER_URL'),
      algorithms: [config.get('AUTH0_ALGO')],
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    return payload;
  }
}