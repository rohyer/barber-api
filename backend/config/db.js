const mysql = require("mysql2");

let pool;

const connectionDB = () => {
  try {
    pool = mysql.createPool({
      host: "db",
      user: "root",
      password: "rootpassword",
      database: "barber"
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
      "Banco de dados não inicializado, chame connectionDB primeiro"
    );
  }
  return pool.promise();
};

connectionDB();

module.exports = getDatabaseConnection;
