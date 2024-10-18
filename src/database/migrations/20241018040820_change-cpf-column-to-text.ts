import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("offenders", (table) => {
        table.text("cpf").alter()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("offenders", (table) => {
        table.integer("cpf").alter()
    })
}

