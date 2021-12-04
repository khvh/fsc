import dotenv from 'dotenv';
import { join } from 'path';
import 'reflect-metadata';
import Container, { Service } from 'typedi';
import { AuthUtils, Context } from './decorators/entities';
import { Server } from './decorators/server';
import { Client, CLIENT_INJECT_TOKEN } from './odm';

dotenv.config();

@Service('authUtils')
class V implements AuthUtils<{ first: string; email: string }> {
  verifyUserToken(ctx: Context): Promise<boolean> {
    // return Promise.resolve(ctx.authorization === 'TOKEN');
    return Promise.resolve(true);
  }

  currentUser(ctx: Context) {
    return Promise.resolve({
      first: 'Test User',
      email: 'user@eample.org'
    });
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
})();
