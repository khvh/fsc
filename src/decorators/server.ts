import fastify, { FastifyInstance } from 'fastify';
import Knex from 'knex';
import { Model } from 'objection';
import readdirp from 'readdirp';
import Container, { Service } from 'typedi';
import { Context } from './controller';

export interface DB {}

export interface ServerOptions {
  port: number;
  controllers?: string;
  dbConfig?: any;
  currentUser?: (context: Context) => void;
  authorize?: (context: Context) => void;
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

  constructor() {
    this.server = fastify({ logger: true });
  }

  async init(opts: ServerOptions) {
    this.opts = opts;

    await this.load(opts.controllers);

    this.currentUser = opts.currentUser || null;
    this.authorize = opts.authorize || null;

    if (opts.dbConfig) {
      const knex = Knex(opts.dbConfig);

      Model.knex(knex);
    }

    Container.set('logger', this.server.log);

    return this;
  }

  async load(str) {
    (await readdirp.promise(str, { fileFilter: '*.*s' })).forEach((controller) => require(controller.fullPath));

    return this;
  }

  start() {
    this.server.listen(this.opts.port);
  }
}
