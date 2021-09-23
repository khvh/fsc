import test from 'ava';
import 'reflect-metadata';
import { Meta } from '../decorators/entities';
import { getMeta, setHandlerMeta } from '../decorators/meta';

test('setHandlerMeta sets routing metadata', (t) => {
  class A {}

  setHandlerMeta(A, 'test', {});

  const meta = Reflect.getMetadata('__meta__', A) as Meta;

  t.not(typeof meta.routes.test, undefined);
});

test('getMeta returns set metadata', (t) => {
  class A {}

  setHandlerMeta(A, 'test', {});

  const meta = getMeta(A);

  t.not(typeof meta.routes.test, undefined);
});
