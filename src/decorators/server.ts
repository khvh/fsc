import { MikroORM } from '@mikro-orm/core';
import fastify, { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { join } from 'path';
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
      const orm = await MikroORM.init(opts.dbConfig);

      Container.set('em', orm.em);

      this.server
        .decorate('em', orm.em)
        .decorateRequest('em', null)
        .addHook('onRequest', async (req: any, reply) => {
          req.em = orm.em;
        });
    }

    return this;
  }

  async load(str) {
    (await readdirp.promise(str, { fileFilter: '*.*s' })).forEach((controller) => require(controller.fullPath));

    readdirSync(str)
      .filter((p) => p.endsWith('.ts'))
      .forEach((controller) => require(join(str, controller)));

    return this;
  }

  start() {
    this.server.listen(this.opts.port);
  }
}
