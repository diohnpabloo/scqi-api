import { hash } from "bcryptjs"
import { knex } from "@/database/knex"
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
                register: z.string({message: "A matrícula deve contar 8 dígitos."}).min(8),
                name: z.string(),
                password: z.string(),
                email: z.string().email({message: "Informe um e-email válido."})
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
            response.json({message: "Aqui"})
        } catch (error) {
            next(error)
        }
    }
}