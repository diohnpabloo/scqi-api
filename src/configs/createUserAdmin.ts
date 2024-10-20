import { hash } from "bcryptjs"
import { knex } from "@/database/knex"
import { env } from "@/env"

export async function createAdminUser() {
    try {
        if (env.ADMIN_USER_CREATED === 'true') {
            console.log("Usuário admin ja foi criado!")
            return;
        }

        const adminUser = {
            register: env.ADMIN_USER_REGISTER,
            name: env.ADMIN_USER_NAME,
            password: env.ADMIN_USER_PASSWORD,
            email: env.ADMIN_USER_EMAIL
        }

        const checkUserExists = await knex("users").where({ register: adminUser.register }).first()

        if (!checkUserExists) {
            const hashedPasswrod = await hash(adminUser.password, 6)
            await knex("users").insert({
                register: adminUser.register,
                name: adminUser.name,
                password: hashedPasswrod,
                email: env.ADMIN_USER_EMAIL,
                role: 'admin',
                is_paid: true,
            })
            console.log("Usuário admin criado com sucesso!")

            env.ADMIN_USER_CREATED="true"

        } else {
            console.log("Usuário admin já existe")
        }
    } catch (error) {
        console.log("Erro ao criar usuário admin: ", error)
    }

}