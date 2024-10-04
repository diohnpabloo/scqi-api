import { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError";

export function verifyUserAuthorization(roleToVerify: string) {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) {
            throw new AppError("Usuário não autenticado.", 401)
        }

        const { role } = request.user

        if (role !== roleToVerify) {
            throw new AppError("Usuário não autorizado.", 401)
        }
        return next()
    }
}