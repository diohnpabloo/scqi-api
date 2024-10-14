import { env } from "@/env";

export default {
  client: env.DATABASE_CLIENT,
  connection: {
    connectionString: env.DATABASE_URL,
  },
  migrations: {
    extensions: "ts",
    directory: "./database/migrations",
  },
  seeds: {
    extensions: "ts",
    directory: "./database/seeds",
  },
};
