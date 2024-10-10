import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary(),
        table.integer("register").notNullable().unique(),
        table.text("name").notNullable(),
        table.text("password").notNullable()
        table.text("email").notNullable(),
        table.enum("role", ["admin", "customer"], { useNative: true, enumName: "roles" }).notNullable().defaultTo("customer"),

        table.boolean("is_paid").notNullable().defaultTo(false)
        table.timestamp("payment_due_date").nullable()

        table.timestamp("created_at").defaultTo(knex.fn.now()),
        table.timestamp("updated_at").defaultTo(knex.fn.now())
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users")
}

