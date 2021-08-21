import { HttpMethod } from './entities';

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

export const Get = (path = '') => handler(path, HttpMethod.Get);

export const Post = (path = '') => handler(path, HttpMethod.Post);

export const Put = (path = '') => handler(path, HttpMethod.Put);

export const Patch = (path = '') => handler(path, HttpMethod.Patch);

export const Delete = (path = '') => handler(path, HttpMethod.Delete);

export const Options = (path = '') => handler(path, HttpMethod.Options);

export const Head = (path = '') => handler(path, HttpMethod.Head);
