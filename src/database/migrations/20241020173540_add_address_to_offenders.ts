import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.table("offenders", (table) => {
        table.text("address").defaultTo("Não cadastrado")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("offenders", (table) => {
        table.dropColumn("address")
    })
}

