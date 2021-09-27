import fastify, { FastifyInstance, FastifyPluginCallback, FastifyRegisterOptions } from 'fastify';
import swagger, { SwaggerOptions } from 'fastify-swagger';
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

  enableOpenAPI(options?: SwaggerOptions, routePrefix = '/_openapi') {
    this.server.register(
      swagger,
      options
        ? {
            ...options,
            routePrefix
          }
        : {
            routePrefix: '/_openapi',
            swagger: {
              info: {
                title: process.env.npm_package_name,
                description: process.env?.npm_package_repository_url ?? '',
                version: process.env.npm_package_version
              }
            },
            exposeRoute: true
          }
    );

    return this;
  }

  register<T = {}>(plugin: FastifyPluginCallback, opts?: FastifyRegisterOptions<T>) {
    this.server.register(plugin, opts);

    return this;
  }

  load(fn: () => void) {
    this.loadables.push(new Promise((resolve) => resolve(fn())));
    return this;
  }

  async run() {
    console.log(this.loadables);
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
