import Knex from 'knex';
import { Model } from 'objection';
import { join } from 'path';
import 'reflect-metadata';
import { Service } from 'typedi';
import dbConfig from '../knexfile';
import { AuthUtils, Context } from './decorators/entities';
import { Server } from './decorators/server';

@Service('authUtils')
class V implements AuthUtils<{ first: string; email: string }> {
  verifyUserToken(ctx: Context): Promise<boolean> {
    return Promise.resolve(ctx.authorization === 'TOKEN');
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

new Server(join(__dirname, 'controller'), 3772)
  .enableOpenAPI()
  .load(() => Model.knex(Knex(dbConfig)))
  .run();
