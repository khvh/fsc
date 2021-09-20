import 'reflect-metadata';
import { RouteMetadata } from '..';
import { Meta } from './entities';

export const getMeta = (target) => {
  if (!Reflect.getMetadata('__meta__', target)) {
    Reflect.defineMetadata(
      '__meta__',
      {
        prefix: '',
        routes: {}
      },
      target
    );
  }

  return Reflect.getMetadata('__meta__', target) as Meta;
};

export const setHandlerMeta = (target, key, data: Partial<RouteMetadata>) => {
  const meta = getMeta(target);

  meta.routes[key] = meta.routes[key] ?? {
    path: '',
    method: null,
    options: null,
    func: null
  };

  meta.routes[key] = {
    ...meta.routes[key],
    ...data
  };
};
