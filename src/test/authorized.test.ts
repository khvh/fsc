import test from 'ava';
import 'reflect-metadata';
import { Authorize } from '../decorators/authorized';
import { Controller } from '../decorators/controller';
import { Meta } from '../decorators/entities';
import { Get } from '../decorators/handler';

test('@Authorize sets checkAuth flag', (t) => {
  @Controller('/test')
  class T {
    @Get('/get.path')
    @Authorize()
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.checkAuth, true);
});

test('@Authorize with roles sets roles for the method', (t) => {
  @Controller('/test')
  class T {
    @Get('/get.path')
    @Authorize({ roles: ['admin'] })
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.roles.includes('admin'), true);
});
