declare module '../../knexfile' {
    import { Knex } from 'knex';

    interface KnexConfig {
        client: string;
        connection: {
            host: string;
            user: string;
            password: string;
            database: string;
        };
        migrations: {
            directory: string;
        };
        seeds: {
            directory: string;
        };
    }

    const config: Knex.Config<KnexConfig>;
    export default config;
}
