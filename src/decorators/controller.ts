import { EntityManager } from '@mikro-orm/mongodb';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { intersection } from 'lodash';
import 'reflect-metadata';
import Container from 'typedi';
import { ForbiddenError } from '../error/forbidden.error';
import { UnauthorizedError } from '../error/unauthorized.error';
import { getMeta } from './meta';
import { Application } from './server';

export interface Context<U = any, B = any, Q = any, P = any> {
  req: FastifyRequest;
  res: FastifyReply;
  em?: EntityManager;
  authorization?: string;
  currentUser?: U;
  body?: B;
  query?: Q;
  params?: P;
  headers?: any;
}

export interface ControllerDescription {
  title?: string;
  description?: string;
}

export function Controller(prefix: string, description?: ControllerDescription) {
  return (target) => {
    const meta = getMeta(target.prototype);

    meta.prefix = prefix;
  };
}

export const register = (server: FastifyInstance, controllers: any[]) => {
  const app = Container.get(Application);

  controllers.forEach((c) => {
    if (!Container.get(c)) {
      Container.set(c);
    }

    const Controller = Container.get(c);
    const meta = getMeta(Controller);

    Object.keys(meta.routes)
      .map((k) => meta.routes[k])
      .forEach(({ path, method, func, options = {}, checkAuth, roles = [] }) => {
        const url = ((meta.prefix || '') + path.replace(/\/$/, '')).replace('//', '/');

        server.route({
          ...options,
          method,
          url,
          handler: async (req, res) => {
            const ctx: Context = {
              req,
              res,
              em: (req as any)?.em as EntityManager,
              authorization: req.headers?.authorization?.replace('Bearer ', ''),
              body: req.body,
              query: req.query,
              params: req.params,
              headers: req.headers,
              currentUser: null
            };

            if (checkAuth) {
              const authorized = await app.verifyUserToken(ctx);

              if (!authorized) {
                res.status(401);

                throw new UnauthorizedError();
              }
            }

            if (app.currentUser) {
              ctx.currentUser = await app.currentUser(ctx);
            }

            if (roles.length > 0) {
              const userRoles = await app.getUserRoles(ctx);

              if (intersection(userRoles, roles).length === 0) {
                res.status(403);

                throw new ForbiddenError();
              }
            }

            return func.apply(Controller, [ctx]);
          }
        });
      });
  });
};
