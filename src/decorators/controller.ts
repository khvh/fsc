import { FastifyInstance } from 'fastify';
import { useContainer } from '../container';
import { Methods } from './entities';

export function Controller(pathPrefix: string): ClassDecorator {
  return function (constructor: Function) {
    Object.entries(constructor.prototype['methods']).forEach(([_key, route]) => {
      const {
        func,
        method,
        path
      }: {
        func: Function;
        method: Methods;
        path: string;
      } = <any>route;
      const url = ((pathPrefix || '') + path.replace(/\/$/, '')).replace('//', '/');

      (useContainer().get('app') as FastifyInstance).route({
        method,
        url,
        handler: async (req, rep) => func(req, rep)
      });
    });
  };
}
