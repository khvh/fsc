import { FastifyReply, FastifyRequest, RouteOptions } from 'fastify';

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
  options?: Partial<RouteOptions<any, any, any, any, any, any>>;
  checkAuth?: boolean;
  roles?: string[];
  func: (...args) => void;
}

export interface Meta {
  prefix: string;
  routes: { [key: string]: RouteMetadata };
}

export interface Context<U = any, B = any, Q = any, P = any> {
  req: FastifyRequest;
  res: FastifyReply;
  authorization?: string;
  currentUser?: U;
  body?: B;
  query?: Q;
  params?: P;
  headers?: any;
}

export interface AuthUtils<U extends unknown = {}> {
  verifyUserToken(ctx: Context): Promise<boolean>;
  currentUser(ctx: Context): Promise<U>;
  getUserRoles(ctx: Context): Promise<string[]>;
}
