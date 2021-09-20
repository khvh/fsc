import fastify, { FastifyInstance } from 'fastify';
import { join } from 'path';
import readdirp from 'readdirp';
import Container, { Service } from 'typedi';
import { register } from './controller';

@Service()
export class Server {
  private loadables = [];

  server: FastifyInstance;

  constructor(private controllers: string = join(__dirname, 'controller'), private port: number = 7331) {
    this.server = fastify({ logger: true });
  }

  register(plugin, opts?) {
    this.server.register(plugin, opts);

    return this;
  }

  load(fn: Promise<any>) {
    this.loadables.push(fn);

    return this;
  }

  async run() {
    await Promise.all(this.loadables);

    register(
      this.server,
      (await readdirp.promise(this.controllers, { fileFilter: '*.*s' }))
        .map((controller) => Object.values(require(controller.fullPath)))
        .flat()
    );

    Container.set('logger', this.server.log);

    this.server.listen(this.port, '0.0.0.0');
  }
}
