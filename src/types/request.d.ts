import { Request } from "express"

declare module "express" {
    export interface Request {
        user?: {
            register: number,
            role: string
        }
    }
}