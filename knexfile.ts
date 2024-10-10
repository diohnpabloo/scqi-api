export default  {
    client: "sqlite3",
    connection: {
      filename: "./database/database.db",
    },
    pool: {
      afterCreate: (connection: any, done: any) => {
        connection.run("PRAGMA foreign_keys = ON");
        done();
      },
    },
    useNullAsDefault: true,
    migrations: {
      extensions: "ts",
      directory: "./database/migrations",
    },
    seeds: {
      extensions: "ts",
      directory: "./database/seeds",
    },
  };
  