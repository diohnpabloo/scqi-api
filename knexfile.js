const { env } = require("./src/env/index");

module.exports = {
  client: env.DATABASE_CLIENT,
  connection: {
    connectionString: env.DATABASE_URL,
  },
  migrations: {
    extensions: "ts",
    directory: "./src/database/migrations",
  },
  seeds: {
    extensions: "ts",
    directory: "./src/database/seeds",
  },
};
