import dotenv from 'dotenv';

dotenv.config();

const { DBSERVER, DBUSER, DBPASSWORD, DBNAME } = process.env;

export const isDbEnabled = () => !!DBSERVER && !!DBNAME;

const conf = {
  client: 'postgresql',
  connection: {
    host: DBSERVER,
    database: DBNAME,
    user: DBUSER,
    password: DBPASSWORD
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: process.env.MIGRATION_DIR || 'migrations'
  }
};

export const development = {
  ...conf
};

export const test = {
  ...conf
};

export const production = {
  ...conf
};

export default conf;
