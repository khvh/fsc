export const Role = (roles: string[]) => {
  return (target, propertyKey, descriptor) => {
    if ((target['methods'] = target['methods'] || {})[propertyKey]) {
      (target['methods'] = target['methods'] || {})[propertyKey].roles = roles;
    }

    return descriptor;
  };
};
