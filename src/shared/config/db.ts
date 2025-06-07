import mysql, { Pool } from "mysql2";

let pool: Pool | undefined;

const connectionDB = () => {
  try {
    pool = mysql.createPool({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
    });

    console.log(`MySQL conectado!`);
  } catch (error) {
    console.log(`Erro ao conectar com o Banco de Dados ${error}`);
    process.exit(1);
  }
};

const getDatabaseConnection = () => {
  if (!pool) {
    throw new Error(
      "Banco de dados não inicializado, chame connectionDB primeiro",
    );
  }
  return pool.promise();
};

connectionDB();

export default getDatabaseConnection;
