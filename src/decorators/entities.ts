import { RouteOptions } from 'fastify';

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Options = 'OPTIONS',
  Head = 'HEAD'
}

export interface RouteMetadata {
  path: string;
  method: HttpMethod;
  options?: RouteOptions;
  checkAuth?: boolean;
  roles?: string[];
  func: (...args) => void;
}

export interface Meta {
  prefix: string;
  routes: { [key: string]: RouteMetadata };
}
// {
//   prefix: '',
//   methods: {}
// }
