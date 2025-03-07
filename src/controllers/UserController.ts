import { hash } from "bcryptjs"
import { knex } from "../database/knex"
import { AppError } from "@/utils/AppError"
import { Request, Response, NextFunction } from "express"
import z from "zod"


export class UserController {
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await knex("users").select()

            response.json(users)
        } catch (error) {
            next(error)
        }
    }

    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                register: z.string({ message: "A matrícula deve contar 8 dígitos." }).min(8),
                name: z.string(),
                password: z.string(),
                email: z.string().email({ message: "Informe um e-email válido." })
            })

            const { register, name, password, email } = bodySchema.parse(request.body)

            const checkUserExists = await knex<UsersRepository>("users").where({ register }).first()

            if (checkUserExists) {
                throw new AppError("Usuário já está cadastrado.")
            }

            const hashedPassword = await hash(password, 6)

            await knex<UsersRepository>("users").insert({ register, name, password: hashedPassword, email })

            response.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                register: z.string(),
                is_paid: z.boolean()
            })

            const { register, is_paid } = bodySchema.parse(request.body)

            const user = await knex('users').where({ register }).first()

            if (!user) {
                throw new AppError("Usuário não encontrado.")
            }

            const data = new Date()

            if (is_paid) {
                data.setDate(data.getDate() + 30)
            }

            await knex('users')
                .where({ register })
                .update({
                    is_paid,
                    payment_due_date: is_paid ? data : null,
                    updated_at: knex.fn.now()
                })

            response.json()
        } catch (error) {
            next(error)
        }
    }
}