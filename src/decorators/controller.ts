import { FastifyInstance } from 'fastify';
import { intersection } from 'lodash';
import 'reflect-metadata';
import Container from 'typedi';
import { ForbiddenError } from '../error/forbidden.error';
import { UnauthorizedError } from '../error/unauthorized.error';
import { AuthUtils, Context } from './entities';
import { getMeta } from './meta';

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
  const validator = Container.get('auth:utils') as AuthUtils;

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
              authorization: req.headers?.authorization?.replace('Bearer ', ''),
              body: req.body,
              query: req.query,
              params: req.params,
              headers: req.headers,
              currentUser: null
            };

            if (checkAuth) {
              const authorized = await (Container.get('validators') as AuthUtils).verifyUserToken(ctx);

              if (!authorized) {
                res.status(401);

                throw new UnauthorizedError();
              }
            }

            if (validator.currentUser) {
              ctx.currentUser = await validator.currentUser(ctx);
            }

            if (roles.length > 0) {
              const userRoles = await validator.getUserRoles(ctx);

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
