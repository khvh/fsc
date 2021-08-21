import { join } from 'path';
import 'reflect-metadata';
import Container from 'typedi';
import dbConfig from '../mikro-orm.config';
import { Application } from './decorators/server';

// useContainer<ContainerInstance>(Container.of('test'));

// const s = new FastifyServer({
//   port: 1337,
//   controllers: join(__dirname, 'controller'),
//   services: join(__dirname, 'services'),
//   orm: async () => {
//     return MikroORM.init({
//       entities: ['./dist/entities/**/*.js'],
//       entitiesTs: ['./src/entities/**/*.ts'],
//       dbName: 'db',
//       type: 'mongo',
//       clientUrl: 'mongodb://user:password@localhost:27017'
//     }).then((orm) => Container.set('em', orm.em));
//   }
// });

(async () =>
  (
    await Container.get(Application).init({
      port: 1337,
      controllers: join(__dirname, 'controller'),
      dbConfig
    })
  ).start())();
