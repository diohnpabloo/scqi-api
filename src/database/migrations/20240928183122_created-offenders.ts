import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("offenders", (table) => {
        table.increments("id").primary,
        table.integer("cpf").unique(),
        table.text("avatar"),
        table.text("name").notNullable(),
        table.text("surname"),
        table.text("mother_name"),
        table.date("date_of_birth")
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("offenders")
}

