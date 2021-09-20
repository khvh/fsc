import Knex from 'knex';
import { Model } from 'objection';
import { join } from 'path';
import 'reflect-metadata';
import Container from 'typedi';
import dbConfig from '../knexfile';
import { AuthUtils, Context } from './decorators/entities';
import { Server } from './decorators/server';

class V implements AuthUtils<{ first: string; email: string }> {
  verifyUserToken(ctx: Context): Promise<boolean> {
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

Container.set('auth:utils', V);

new Server(join(__dirname, 'controller'))
  .load(
    new Promise<any>(async (r) => {
      const knex = Knex(dbConfig);

      Model.knex(knex);

      r(true);
    })
  )
  .run();
