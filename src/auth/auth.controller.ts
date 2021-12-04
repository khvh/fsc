import { stringify } from 'qs';
import { Inject, Service } from 'typedi';
import { Controller } from '..';
import { Context } from '../decorators/entities';
import { Get } from '../decorators/handler';
import { OpenIDAuthService } from '../services/auth.service';

@Service()
@Controller('_oidc')
export class OpenIDAuthController {
  @Inject() authService: OpenIDAuthService;

  @Get('/authenticate')
  authenticate(c: Context<any>) {
    const url = this.authService.authenticate(c.query.redirect);

    return { ...url };
  }

  @Get('/authenticated')
  async authenticated(c: Context<any>) {
    const res = await this.authService.getToken(c.query.code, c.query.redirect);

    const params = stringify({
      access: res.accessToken,
      refresh: res.refreshToken,
      refreshExpires: res.refreshExpiresIn
    });

    c.res.redirect(c.query.redirect + `?${params}`);

    return res;
  }

  @Get('/test')
  async test(c: Context<any>) {
    return this.authService.userInfo(c.authorization ?? c.query.access);
  }

  @Get('/userinfo')
  async userInfo(c: Context<any>) {
    return this.authService.userInfo(c.authorization);
  }
}
