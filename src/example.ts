import dotenv from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { AuthUtils, Context } from './decorators/entities';
import { Server } from './decorators/server';
import { Client, CLIENT_INJECT_TOKEN } from './odm';
import { OpenIDAuthService } from './services/auth.service';

dotenv.config();

@Service('authUtils')
class V implements AuthUtils<{ first: string; email: string }> {
  verifyUserToken(ctx: Context): Promise<boolean> {
    return Container.get(OpenIDAuthService).verifyToken(ctx.authorization);
  }

  currentUser(ctx: Context) {
    return Container.get(OpenIDAuthService).decodeUser<{ first: string; email: string }>(ctx.authorization);
  }

  getUserRoles(ctx: Context) {
    return Promise.resolve([]);
  }
}

(async () => {
  await new Server(join(__dirname, 'controller'), 3772)
    .enableOpenAPI()
    .load(async () => {
      Container.set(CLIENT_INJECT_TOKEN, await new Client(process.env.MONGO_URL, process.env.MONGO_DB).connect());
    })
    .run();

  await Container.get(OpenIDAuthService)
    .setConfig({
      provider: process.env.OIDC,
      clientId: process.env.OIDC_CLIENT,
      clientSecret: process.env.OIDC_SECRET,
      redirect: process.env.OIDC_REDIRECT
    })
    .fetchWellKnown();
  await Container.get(OpenIDAuthService).fetchKeys();
})();
