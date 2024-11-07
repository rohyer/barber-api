const mysql = require("mysql2");

const connectionDB = () => {
  try {
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      database: "barber"
    });

    console.log(`MySQL connected`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectionDB;
