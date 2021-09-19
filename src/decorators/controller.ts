import { EntityManager } from '@mikro-orm/mongodb';
import { FastifyReply, FastifyRequest } from 'fastify';
import { intersection } from 'lodash';
import Container from 'typedi';
import { ForbiddenError } from '../error/forbidden.error';
import { UnauthorizedError } from '../error/unauthorized.error';
import { HttpMethod } from './entities';
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
}

export interface ControllerDescription {
  title?: string;
  description?: string;
}

export function Controller(prefix = '/', description?: ControllerDescription) {
  return function <T extends { new (...args: any[]): {} }>(Base: T) {
    if (!Base.prototype.methods) {
      return;
    }

    Object.entries(Base.prototype['methods']).forEach(([_key, route]) => {
      const {
        func,
        method,
        path,
        checkAuth,
        roles = []
      }: {
        func: Function;
        method: HttpMethod;
        path: string;
        checkAuth?: boolean;
        roles?: string[];
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
            em: (req as any)?.em as EntityManager,
            authorization: req.headers?.authorization?.replace('Bearer ', ''),
            body: req.body,
            query: req.query,
            params: req.params,
            currentUser: null
          };

          if (checkAuth && !ctx.authorization) {
            res.status(401);

            throw new UnauthorizedError();
          }

          if (checkAuth && ctx.authorization) {
            const authorized = await app.verifyUserToken(ctx.authorization);

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

          return Container.get(Base)[func.name](ctx);
        }
      });
    });
  };
}
