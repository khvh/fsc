import { RouteOptions } from 'fastify';
import 'reflect-metadata';
import { HttpMethod } from './entities';
import { setHandlerMeta } from './meta';

export interface HandlerDescription {
  title?: string;
  description?: string;
}

const handler = (path = '', method: HttpMethod) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method,
      func: descriptor.value
    };

    return descriptor;
  };
};

export const Handle = (path: string, method: HttpMethod = HttpMethod.Get, options?: RouteOptions) => {
  return function (t, p, d) {
    setHandlerMeta(t, p, {
      path,
      method,
      options,
      func: d.value
    });
  };
};

export const Get = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Get, options);

export const Post = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Post, options);

export const Put = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Put, options);

export const Patch = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Patch, options);

export const Delete = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Delete, options);

export const Options = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Options, options);

export const Head = (path = '', options?: RouteOptions, description?: HandlerDescription) =>
  Handle(path, HttpMethod.Head, options);
