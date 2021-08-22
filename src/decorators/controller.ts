import { FastifyReply, FastifyRequest } from 'fastify';
import Container from 'typedi';
import { HttpMethod } from './entities';
import { Application } from './server';

export interface Context<U = any, B = any, Q = any, P = any> {
  req: FastifyRequest;
  res: FastifyReply;
  authorization?: string;
  currentUser?: U;
  body?: B;
  query?: Q;
  params?: P;
}

export function Controller(prefix = '/') {
  return function <T extends { new (...args: any[]): {} }>(Base: T) {
    Object.entries(Base.prototype['methods']).forEach(([_key, route]) => {
      const {
        func,
        method,
        path
      }: {
        func: Function;
        method: HttpMethod;
        path: string;
      } = <any>route;
      const url = ((prefix || '') + path.replace(/\/$/, '')).replace('//', '/');
      const app = Container.get(Application);

      app.server.route({
        method,
        url,
        handler: async (req, res) => {
          const ctx: Context = {
            req,
            res,
            authorization: req.headers?.authorization?.replace('Bearer ', ''),
            body: req.body,
            query: req.query,
            params: req.params,
            currentUser: null
          };

          if (app.currentUser) {
            ctx.currentUser = await app.currentUser(ctx);
          }

          return Container.get(Base)[func.name](ctx);
        }
      });
    });
  };
}
