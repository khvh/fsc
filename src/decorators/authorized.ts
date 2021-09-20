import { setHandlerMeta } from './meta';

export interface AuthorizedOptions {
  roles?: string[];
}

export const Authorize = (opts: AuthorizedOptions = { roles: [] }) => {
  return (t, p, d) => {
    setHandlerMeta(t, p, {
      checkAuth: true,
      roles: opts.roles
    });
  };
};
