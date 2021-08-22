import { HttpMethod } from './entities';

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

export const Get = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Get);

export const Post = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Post);

export const Put = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Put);

export const Patch = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Patch);

export const Delete = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Delete);

export const Options = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Options);

export const Head = (path = '', description?: HandlerDescription) => handler(path, HttpMethod.Head);
