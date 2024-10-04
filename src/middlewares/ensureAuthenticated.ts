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
        const decoded = verify(token, authConfig.jwt.secret)

        if (typeof decoded === "string") {
            throw new AppError("JWT Token inválido")
        }

        const { role, sub: user_register } = decoded

        request.user = {
            register: Number(user_register),
            role
        }

        return next()
    } catch (error) {
        throw new AppError("JWT Token inválido", 401)
    }

}