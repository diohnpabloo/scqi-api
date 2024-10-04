import { Router } from "express"
import { userRoutes } from "./userRoutes"
import { sessionRoutes } from "./sessionsRoutes"
import { offenderRoutes } from "./OffenderRoutes"

export const routes = Router()

routes.use("/users", userRoutes)
routes.use("/sessions", sessionRoutes)
routes.use("/offenders", offenderRoutes)