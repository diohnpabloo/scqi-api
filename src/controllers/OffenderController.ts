import { Request, Response, NextFunction } from "express";
import { knex } from "../database/knex";
import { DiskStorage } from "@/providers/DiskStorage";
import { S3Storage } from "@/providers/S3Storage"
import { AppError } from "@/utils/AppError";
import moment from 'moment'


export class OffenderController {
    async create(request: Request, response: Response, next: NextFunction) {
        const diskstorage = new DiskStorage()
        const s3Storage = new S3Storage()

        const file = request.file

        if (!file) {
            return next(new AppError('Imagem não enviada para cadastro.'));
        }
        const originalName = file.originalname

        try {
            let { cpf, name, surname, mother_name, date_of_birth } = request.body

            const offenders = await knex("offenders").where({ cpf }).first()
            if (offenders) {
                throw new AppError("Infrator já cadastrado na base de dados.")
            }

            if (date_of_birth) {
                date_of_birth = moment(date_of_birth, "DD/MM/YYYY").format("yyyy-MM-DD")
            }



            const avatarKey = await s3Storage.uploadFile(file.filename, originalName)

            await knex("offenders").insert({
                cpf,
                name,
                surname,
                mother_name,
                date_of_birth,
                avatar: avatarKey
            })



            await diskstorage.deleteFile(file.filename)

            response.status(201).json()
        } catch (error) {
            if (file && file.filename) {
                await diskstorage.deleteFile(file.filename)
            }
            next(error)
        }
    }

    async find(request: Request, response: Response, next: NextFunction) {
        try {
            const { cpf, name, surname, mother_name, date_of_birth } = request.query

            if (!cpf && !name && !surname && !mother_name && !date_of_birth) {
                throw new AppError("Nenhum campo de busca informado.")
            }

            const query = knex("offenders")

            if (typeof cpf === 'string') {
                query.whereRaw('LOWER(cpf) = ?', [cpf.toLowerCase()]);
            }

            if (typeof name === 'string') {
                query.andWhere('name', 'like', `%${name.toLowerCase()}%`);
            }

            if (typeof surname === 'string') {
                query.andWhere('surname', 'like', `%${surname.toLowerCase()}%`);
            }

            if (typeof mother_name === 'string') {
                query.andWhere('mother_name', 'like', `%${mother_name.toLowerCase()}%`);
            }

            if (typeof date_of_birth === 'string') {
                query.andWhereRaw('LOWER(date_of_birth) = ?', [date_of_birth.toLowerCase()]);
            }


            if (Object.keys(query).length === 0) {
                throw new AppError("Nenhum campo de busca informado.")
            }
            const offenders = await query.first()

            if (!offenders || offenders.length === 0) {
                throw new AppError("Nenhum infrator encontrado.")
            }

            response.json(offenders);
        } catch (error) {
            next(error)
        }
    }
}