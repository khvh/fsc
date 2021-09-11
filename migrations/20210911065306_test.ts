import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('members', (t) => {
    t.uuid('id').primary();
    t.string('external_id');
    t.string('first');
    t.string('last');
    t.string('email');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('members');
}
