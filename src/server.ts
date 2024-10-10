import "dotenv/config"
import express, { NextFunction, Request, Response } from 'express'
import { routes } from './routes'
import { errorHandling } from './middlewares/errorHandling'
import { UPLOADS_FOLDER } from './configs/upload'
import { schedulePaymentStatusUpdate } from "./service/schedulePaymentStatusUpdated"


const app = express()
app.use(express.json())

app.use("/offenders", express.static(UPLOADS_FOLDER))
app.use(routes)
schedulePaymentStatusUpdate()

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    errorHandling(error, request, response, next)
})

const PORT = process.env.PORT || 3333
app.listen(PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})