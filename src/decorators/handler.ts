import { RouteOptions } from 'fastify';
import 'reflect-metadata';
import { HttpMethod } from './entities';
import { setHandlerMeta } from './meta';

export const Handle = (
  path: string,
  method: HttpMethod = HttpMethod.Get,
  options?: Partial<RouteOptions<any, any, any, any, any, any>>
) => {
  return function (t, p, d) {
    setHandlerMeta(t, p, {
      path,
      method,
      options,
      func: d.value
    });
  };
};

export const Get = (path = '', options?: Partial<RouteOptions<any, any, any, any, any, any>>) =>
  Handle(path, HttpMethod.Get, options);

export const Post = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Post, options);

export const Put = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Put, options);

export const Patch = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Patch, options);

export const Delete = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Delete, options);

export const Options = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Options, options);

export const Head = (path = '', options?: RouteOptions) => Handle(path, HttpMethod.Head, options);
