import path from "node:path";
import fs from "node:fs"
import crypto from "node:crypto"

import { env } from "../env";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { TMP_FOLDER, UPLOADS_FOLDER } from "@/configs/upload";
import mime from 'mime-types'


export class S3Storage {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: env.CLOUD_BUCKET_REGION,
            credentials: {
                accessKeyId: env.CLOUD_ACCESS_KEY,
                secretAccessKey: env.CLOUD_SECRET_ACESS_KEY
            }
        })
    }

    async uploadFile(filename: string, originalName: string): Promise<string> {
        const filePath = path.resolve(UPLOADS_FOLDER, filename)
        const fileContent = fs.readFileSync(filePath)
        const ContentType = mime.contentType(filePath) || undefined

        const fileHash = crypto.randomBytes(10).toString('hex')
        const key = `${fileHash}-${originalName}`

        const command = new PutObjectCommand({
            Bucket: env.CLOUD_BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType,
            ACL: 'public-read'
        })

        await this.client.send(command)

        return key
        // return `https://${env.CLOUD_BUCKET_NAME}.s3.${env.CLOUD_BUCKET_REGION}.amazonaws.com/${key}`;
    }

    async DeleteBucketLifecycleCommand(filename: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: env.CLOUD_BUCKET_NAME,
            Key: filename,
        })

        await this.client.send(command)
    }
}