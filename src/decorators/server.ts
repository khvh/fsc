import { MikroORM } from '@mikro-orm/core';
import fastify, { FastifyInstance } from 'fastify';
import { readdirSync } from 'fs';
import { join } from 'path';
import Container, { Service } from 'typedi';

export interface DB {}

export interface ServerOptions {
  port: number;
  controllers?: string;
  dbConfig: any;
}

export class FastifyServer {
  app!: FastifyInstance;
}

@Service()
export class Application {
  opts: ServerOptions;
  server: FastifyInstance;

  constructor() {
    this.server = fastify({ logger: true });
  }

  async init(opts: ServerOptions) {
    this.opts = opts;

    this.load(opts.controllers);

    const orm = await MikroORM.init(opts.dbConfig);

    Container.set('em', orm.em);

    this.server
      .decorate('em', orm.em)
      .decorateRequest('em', null)
      .addHook('onRequest', async (req: any, reply) => {
        req.em = orm.em;
      });

    return this;
  }

  load(str) {
    readdirSync(str)
      .filter((p) => p.endsWith('.ts'))
      .forEach((controller) => require(join(str, controller)));

    return this;
  }

  start() {
    this.server.listen(this.opts.port);
  }
}
