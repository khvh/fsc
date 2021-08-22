import { join } from 'path';
import 'reflect-metadata';
import Container from 'typedi';
import { Context } from './decorators/controller';
import { Application } from './decorators/server';

(async () =>
  (
    await Container.get(Application).init({
      port: 1338,
      controllers: join(__dirname, 'controller'),
      currentUser: (ctx: Context) => ({
        first: 'Test User',
        email: 'test@example.org'
      })
    })
  ).start())();
