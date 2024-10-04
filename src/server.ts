import express, { NextFunction, Request, Response } from 'express'
import { routes } from './routes'
import { errorHandling } from './middlewares/errorHandling'
import { UPLOADS_FOLDER } from './configs/upload'

const PORT = 3333

const app = express()
app.use(express.json())

app.use("/offenders", express.static(UPLOADS_FOLDER))
app.use(routes)

app.use((error: any, request: Request, response: Response, next: NextFunction) => {
    errorHandling(error, request, response, next)
})


app.listen(PORT, () => {
    console.log("Server is runing")
})