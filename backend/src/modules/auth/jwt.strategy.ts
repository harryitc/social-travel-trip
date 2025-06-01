import { UserMock } from '@configs/app/dev-mocks';
import { UserService } from '@modules/user/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'CAK_HARRYITC',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    return user ?? UserMock; // attach vào request.user
  }
}
