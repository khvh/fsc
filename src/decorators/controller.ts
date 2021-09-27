import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { intersection } from 'lodash';
import 'reflect-metadata';
import Container from 'typedi';
import { EmptyPathError } from '../error/empty-path.error';
import { ForbiddenError } from '../error/forbidden.error';
import { UnauthorizedError } from '../error/unauthorized.error';
import { AuthUtils, Context } from './entities';
import { getMeta } from './meta';

export const AUTH_UTILS_CONTAINER = 'authUtils';

export interface ControllerDescription {
  title?: string;
  description?: string;
}

export function Controller(prefix: string, description?: ControllerDescription) {
  if (prefix === null || prefix.trim() === '') {
    throw new EmptyPathError();
  }

  return (target) => {
    const meta = getMeta(target.prototype);

    meta.prefix = prefix;
  };
}

const getRouteUrl = (prefix: string, path: string) => {
  return ((prefix || '') + path.replace(/\/$/, '')).replace('//', '/');
};

const createContext = (req: FastifyRequest, res: FastifyReply) => ({
  req,
  res,
  authorization: req.headers?.authorization?.replace('Bearer ', ''),
  body: req.body,
  query: req.query,
  params: req.params,
  headers: req.headers,
  currentUser: null
});

const authorize = async (ctx: Context, res: FastifyReply) => {
  const authorized = await (Container.get(AUTH_UTILS_CONTAINER) as AuthUtils).verifyUserToken(ctx);

  if (!authorized) {
    res.status(401);

    throw new UnauthorizedError();
  }
};

const authorizeRoles = async (roles, ctx: Context, res: FastifyReply) => {
  const userRoles = await (Container.get(AUTH_UTILS_CONTAINER) as AuthUtils).getUserRoles(ctx);

  if (intersection(userRoles, roles).length === 0) {
    res.status(403);

    throw new ForbiddenError();
  }
};

const registerController = (server: FastifyInstance, Controller: any, validator: AuthUtils) => {
  if (!Container.get(Controller)) {
    Container.set(Controller);
  }

  Controller = Container.get(Controller);

  const { prefix, routes } = getMeta(Controller);

  const routePaths = Object.keys(routes)
    .map((k) => routes[k])
    .map(({ path, method, func, options = {}, checkAuth, roles = [] }) => {
      server.route({
        ...options,
        method,
        url: getRouteUrl(prefix, path),
        handler: async (req, res) => {
          const ctx = createContext(req, res);

          if (checkAuth) {
            try {
              await authorize(ctx, res);
            } catch (err) {
              return res.send(err);
            }
          }

          try {
            ctx.currentUser = await validator.currentUser(ctx);
          } catch (err) {}

          if (roles.length > 0) {
            authorizeRoles(roles, ctx, res);
          }

          return func.apply(Controller, [ctx]);
        }
      });

      return path;
    });

  return { prefix, routePaths };
};

export const register = (server: FastifyInstance, controllers: any[]) => {
  const routes = new Map<string, string[]>();
  const validator = Container.get(AUTH_UTILS_CONTAINER) as AuthUtils;

  controllers
    .map((controller) => registerController(server, controller, validator))
    .forEach(({ prefix, routePaths }) => routes.set(prefix, routePaths));

  return routes;
};
