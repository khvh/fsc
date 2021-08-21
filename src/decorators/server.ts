import fastify, { FastifyInstance } from 'fastify';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { useContainer } from '../container';

export interface ServerOptions {
  port: number;
  controllers: string;
  orm?: () => void;
}

export class FastifyServer {
  app!: FastifyInstance;

  constructor(
    public opts: ServerOptions = {
      port: 1337,
      controllers: null
    }
  ) {
    this.app = fastify({
      logger: true
    });

    useContainer().set('app', this.app);

    this.load();
  }

  run() {
    this.app.listen(this.opts.port);
  }

  private load() {
    Promise.all([this.loadOrm(), this.loadControllers()]).then(() => {
      this.run();
    });
  }

  private async loadOrm() {
    if (this.opts.orm) {
      return await this.opts.orm();
    }

    return Promise.resolve(null);
  }

  private async loadControllers() {
    return readdir(this.opts.controllers).then((files) => {
      files.filter((p) => p.endsWith('.ts')).forEach((controller) => require(join(this.opts.controllers, controller)));

      return true;
    });
  }
}
