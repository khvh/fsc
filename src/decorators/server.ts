import fastify, { FastifyInstance } from 'fastify';
import Knex from 'knex';
import { Model } from 'objection';
import readdirp from 'readdirp';
import Container, { Service } from 'typedi';
import { Context, register } from './controller';

export interface DB {}

export interface ServerOptions {
  port: number;
  controllers?: string;
  dbConfig?: any;
  currentUser?: (context: Context) => void;
  authorize?: (context: Context) => void;
  verifyUserToken?: (context: Context) => Promise<boolean>;
  getUserRoles?: (context: Context) => Promise<string[]>;
}

export class FastifyServer {
  app!: FastifyInstance;
}

@Service()
export class Application {
  opts: ServerOptions;
  server: FastifyInstance;
  currentUser?: (context: Context) => void;
  authorize?: (context: Context) => void;
  verifyUserToken?: (context: Context) => Promise<boolean>;
  getUserRoles?: (context: Context) => Promise<string[]>;

  constructor() {
    this.server = fastify({ logger: true });
  }

  async init(opts: ServerOptions) {
    this.opts = opts;

    await this.load(opts.controllers);

    this.currentUser = opts.currentUser || null;
    this.authorize = opts.authorize || null;
    this.verifyUserToken = opts.verifyUserToken || null;
    this.getUserRoles = opts.getUserRoles || null;

    if (opts.dbConfig) {
      const knex = Knex(opts.dbConfig);

      Model.knex(knex);
    }

    Container.set('logger', this.server.log);

    return this;
  }

  async load(str) {
    // const controllers = Object.values(
    //   (await readdirp.promise(str, { fileFilter: '*.*s' })).map((controller) => require(controller.fullPath))
    // );

    register(
      this.server,
      (await readdirp.promise(str, { fileFilter: '*.*s' }))
        .map((controller) => Object.values(require(controller.fullPath)))
        .flat()
    );

    return this;
  }

  start() {
    this.server.listen(this.opts.port, '0.0.0.0');
  }
}
