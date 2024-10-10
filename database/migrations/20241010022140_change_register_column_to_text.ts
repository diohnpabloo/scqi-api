import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.text("register").alter()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.integer("register").alter()
    })
}

