import "dotenv/config"
import express, { NextFunction, Request, Response } from 'express'
import { routes } from './routes'
import { errorHandling } from './middlewares/errorHandling'
import { UPLOADS_FOLDER } from './configs/upload'
import { schedulePaymentStatusUpdate } from "./service/SchedulePaymentStatusUpdated"
import { createAdminUser } from "./configs/createUserAdmin"


export const app = express()
app.use(express.json())

app.use("/offenders", express.static(UPLOADS_FOLDER))
app.use(routes)
schedulePaymentStatusUpdate()
createAdminUser()

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    errorHandling(error, request, response, next)
})
