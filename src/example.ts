import { MikroORM } from '@mikro-orm/core';
import { join } from 'path';
import Container, { ContainerInstance } from 'typedi';
import { useContainer } from './container';
import { FastifyServer } from './decorators/server';

useContainer<ContainerInstance>(Container.of('test'));

new FastifyServer({
  port: 1337,
  controllers: join(__dirname, 'controller'),
  orm: async () => {
    return MikroORM.init({
      entities: ['./dist/entities/**/*.js'],
      entitiesTs: ['./src/entities/**/*.ts'],
      dbName: 'db',
      type: 'mongo',
      clientUrl: 'mongodb://user:password@localhost:27017'
    }).then((orm) => useContainer().set('em', orm.em));
  }
});
