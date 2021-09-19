import crypto from 'crypto';
import { join } from 'path';
import qs from 'qs';
import 'reflect-metadata';
import Container from 'typedi';
import config from '../knexfile';
import { Context } from './decorators/controller';
import { Application } from './decorators/server';

let i = 0;

const getMessageSignature = (path, request, secret, nonce) => {
  const message = qs.stringify(request);
  const secret_buffer = Buffer.from(secret, 'base64');
  const hash = crypto.createHash('sha256');
  const hmac = crypto.createHmac('sha512', secret_buffer);
  const hash_digest = hash.update(nonce + message).digest();
  const hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');

  return hmac_digest;
};

(async () => {
  (
    await Container.get(Application).init({
      port: 1338,
      controllers: join(__dirname, 'controller'),
      currentUser: (ctx: Context) => ({
        first: 'Test User',
        email: 'test@example.org'
      }),
      verifyUserToken: (ctx: Context) => {
        return Promise.resolve(ctx.authorization === 'TOKEN');
      },
      getUserRoles: () => {
        return Promise.resolve(['admin', 'lmao']);
      },
      dbConfig: config
    })
  ).start();
})();
