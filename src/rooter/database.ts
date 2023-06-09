import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { test_table, utilisateur, connexionToken, workspace, relation, exercice } from '../models';

const pool = new Pool({
  user: 'algebre',
  host: 'localhost',
  database: 'postgres',
  password: '$H55!$r3GAiQ5',
  port: 5432,
});


interface Database {
    test_table:test_table
    utilisateur:utilisateur
    connexiontoken:connexionToken
    workspace:workspace
    relation:relation
    exercice:exercice
}
// You'd create one of these when you start your app.
export const db = new Kysely<Database>({
  // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
  dialect: new PostgresDialect({
    pool: pool
  })
})

export const executeSQL = async (query:string, values:Array<string> | null = null) => {
  var result = await pool.query({
      text: query,
      values : values ?? []
  });
  return result.rows
}