import { compare } from "bcryptjs"
import { Request, Response, NextFunction } from "express"
import { knex } from "@/database/knex"
import { AppError } from "@/utils/AppError"
import z from "zod"
import authConfig from "@/configs/auth"
import { sign } from "jsonwebtoken"

export class SessionController {
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                register: z.string(),
                password: z.string()
            })

            const { register, password } = bodySchema.parse(request.body)

            const user = await knex<UsersRepository>("users").where({ register }).first()

            if (!user) {
                throw new AppError("Matrícula e/ou senha incorretas.", 401)
            }

            const passwordMatched = await compare(password, user.password)

            if (!passwordMatched) {
                throw new AppError("Matrícula e/ou senha incorretas.", 401)
            }

            const { secret, expiresIn } = authConfig.jwt
            const token = sign({ role: user.role }, secret, {
                subject: String(user.register),
                expiresIn
            })

            response.json({ user, token })
        } catch (error) {
            next(error)
        }
    }
}