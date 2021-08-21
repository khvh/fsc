import Container from 'typedi';
import { HttpMethod } from './entities';
import { Application } from './server';

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

      Container.get(Application).server.route({
        method,
        url,
        handler: async (req, rep) => Container.get(Base)[func.name](req, rep)
      });
    });
  };
}
