import test from 'ava';
import fastify from 'fastify';
import 'reflect-metadata';
import { Service } from 'typedi';
import { Controller, register } from '../decorators/controller';
import { AuthUtils, Context, Meta } from '../decorators/entities';
import { Get } from '../decorators/handler';
import { EmptyPathError } from '../error/empty-path.error';

@Service('authUtils')
class V implements AuthUtils<{ first: string; email: string }> {
  verifyUserToken(ctx: Context): Promise<boolean> {
    return Promise.resolve(true);
  }

  currentUser(ctx: Context) {
    return Promise.resolve({
      first: 'Test User',
      email: 'user@eample.org'
    });
  }

  getUserRoles(ctx: Context) {
    return Promise.resolve([]);
  }
}

test('@Controller creates metadata for itself', async (t) => {
  const prefix = '/path';

  @Controller('/path')
  class C {}

  const c = new C();
  const meta = Reflect.getMetadata('__meta__', c) as Meta;

  t.is(meta.prefix, prefix);
});

test('@Controller throws for empty or null path', (t) => {
  ['', null].forEach((p) => {
    const err = t.throws(
      () => {
        @Controller(p)
        class C {}
      },
      { instanceOf: EmptyPathError }
    );

    t.is(err.message, 'Path cannot be empty');
  });
});

test('register registers a controller', (t) => {
  const f = fastify();

  @Controller('/test')
  @Service()
  class C {
    @Get('')
    test() {
      return {};
    }
  }

  const registered = register(f, [C]);

  t.is(registered.size, 1);
});
