export function Get(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method: 'GET',
      func: descriptor.value
    };
    return descriptor;
  };
}

export function Post(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method: 'POST',
      func: descriptor.value
    };
    return descriptor;
  };
}

export function Put(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method: 'PUT',
      func: descriptor.value
    };
    return descriptor;
  };
}

export function Patch(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method: 'PATCH',
      func: descriptor.value
    };
    return descriptor;
  };
}

export function Delete(path: string): MethodDecorator {
  return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): PropertyDescriptor {
    (target['methods'] = target['methods'] || {})[propertyKey] = {
      path,
      method: 'DELETE',
      func: descriptor.value
    };
    return descriptor;
  };
}
