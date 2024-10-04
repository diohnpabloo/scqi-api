import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { AppError } from "@/utils/AppError"
import authConfig from "@/configs/auth"

export function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization

    if (!authHeader) {
        throw new AppError("JWT Token não informado", 401)
    }

    const [, token] = authHeader.split(" ")

    try {
        const {sub: user_register } = verify(token, authConfig.jwt.secret)

        request.user = {
            register: Number(user_register)
        }

        return next()
    } catch (error) {
        throw new AppError("JWT Token inválido", 401)
    }

}