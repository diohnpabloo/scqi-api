import { Router } from "express"
import { OffenderController } from "@/controllers/OffenderController"
import multer from "multer"
import { MULTER } from "@/configs/upload"

export const offenderRoutes = Router()
const offenderController = new OffenderController()

const upload = multer(MULTER)

offenderRoutes.post("/", upload.single("avatar"), offenderController.create)
offenderRoutes.get("/", offenderController.find)
offenderRoutes.get("/:offenderName", offenderController.show)
