import test from 'ava';
import 'reflect-metadata';
import { Controller } from '../decorators/controller';
import { Meta } from '../decorators/entities';
import { Delete, Get, Head, Options, Patch, Post, Put } from '../decorators/handler';

test('@Get creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Get('/get.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/get.path');
  t.is(meta.routes.test.method, 'GET');
});

test('@Post creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Post('/post.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/post.path');
  t.is(meta.routes.test.method, 'POST');
});

test('@Put creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Put('/put.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/put.path');
  t.is(meta.routes.test.method, 'PUT');
});

test('@Patch creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Patch('/patch.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/patch.path');
  t.is(meta.routes.test.method, 'PATCH');
});

test('@Delete creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Delete('/delete.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/delete.path');
  t.is(meta.routes.test.method, 'DELETE');
});

test('@Options creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Options('/options.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/options.path');
  t.is(meta.routes.test.method, 'OPTIONS');
});

test('@Head creates proper metadata', (t) => {
  @Controller('/test')
  class T {
    @Head('/head.path')
    test() {
      return null;
    }
  }

  const target = new T();
  const meta = Reflect.getMetadata('__meta__', target) as Meta;

  t.is(meta.routes.test.path, '/head.path');
  t.is(meta.routes.test.method, 'HEAD');
});
