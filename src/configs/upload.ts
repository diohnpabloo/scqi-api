import path from "node:path";
import crypto from "crypto"
import multer from "multer";

export const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
export const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads")



export const MULTER = {
    dest: UPLOADS_FOLDER,
    storage: multer.diskStorage({
      destination: UPLOADS_FOLDER,
      filename(request, file, callback) {
          const fileHash = crypto.randomBytes(10).toString("hex")
          const fileName = `${fileHash}-${file.originalname}`

          return callback(null, fileName)
      }
  }),
}