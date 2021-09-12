export interface AuthorizedOptions {
  roles?: string[];
}

export const Authorized = (opts: AuthorizedOptions = { roles: [] }) => {
  const { roles } = opts;

  return (target, propertyKey, descriptor) => {
    if ((target['methods'] = target['methods'] || {})[propertyKey]) {
      (target['methods'] = target['methods'] || {})[propertyKey].checkAuth = true;
      (target['methods'] = target['methods'] || {})[propertyKey].roles = roles;
    }

    return descriptor;
  };
};
