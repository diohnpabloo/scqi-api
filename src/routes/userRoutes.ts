import { Router } from "express"
import { UserController } from "@/controllers/UserController"
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization"

export const userRoutes = Router()
const userController = new UserController()

userRoutes.use(ensureAuthenticated)
userRoutes.use(verifyUserAuthorization("admin"))

userRoutes.get("/", userController.index)
userRoutes.post("/", userController.create)

