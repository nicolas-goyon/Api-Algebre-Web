import { Pool } from 'pg';

const pool = new Pool({
  user: 'algebre',
  host: 'localhost',
  database: 'algebre',
  password: 'postgres',
  port: 5432,
});
export const getShema = async () => {
  const { rows } = await pool.query('SELECT * FROM information_schema.columns');
  return rows;
};
