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
            let { cpf, name, surname, mother_name, date_of_birth, address } = request.body
            if (cpf === '') {
                cpf = null
            }
            if (cpf && cpf !== null) {
                const offenders = await knex("offenders").where({ cpf }).first()
                if (offenders) {
                    throw new AppError("Infrator já cadastrado na base de dados.")
                }
            }

            if (date_of_birth) {
                date_of_birth = moment(date_of_birth, "DD/MM/YYYY").format("yyyy-MM-DD")
            }

            const avatarKey = await s3Storage.uploadFile(file.filename, originalName)

            const offenderData = {
                cpf,
                name,
                surname,
                mother_name,
                address,
                date_of_birth: date_of_birth === "Não cadastrado" ? null : date_of_birth,
                avatar: avatarKey,
            };

            await knex("offenders").insert(offenderData)

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
        const { cpf, name, surname, mother_name, date_of_birth } = request.query;

        if (!cpf && !name && !surname && !mother_name && !date_of_birth) {
            return next(new AppError("Nenhum campo de busca informado."));
        }
        try {
            const query = knex("offenders")

            if (typeof cpf === 'string') {
                query.whereRaw('LOWER(cpf) = ?', [cpf.toLowerCase()]);
            }

            if (typeof name === 'string') {
                query.orWhereRaw('LOWER(name) LIKE ?', [`%${name.toLowerCase()}%`]);
            }

            if (typeof surname === 'string') {
                query.orWhereRaw('LOWER(surname) LIKE ?', [`%${surname.toLowerCase()}%`]);
            }

            if (typeof mother_name === 'string') {
                query.orWhereRaw('LOWER(mother_name) LIKE ?', [`%${mother_name.toLowerCase()}%`]);
            }

            if (typeof date_of_birth === 'string') {
                const formattedDate = moment(date_of_birth, "DD/MM/YYYY").format("YYYY-MM-DD");
                query.andWhere('date_of_birth', formattedDate);
            }

            const offenders = await query
            if (offenders.length === 0) {
                throw new AppError("Nenhum infrator encontrado.");
            }

            response.json(offenders);
        } catch (error) {
            next(error);
        }
    }

    async show(request: Request, response: Response, next: NextFunction) {
        try {
            let { offenderName } = request.params
            offenderName = decodeURIComponent(offenderName).trim()
            console.log("nome decodificado", offenderName)

            const offender = await knex("offenders").whereILike({ name: offenderName }).first()
            console.log("Resultado da busca", offender)

            if(!offender) {
                return response.status(404).json({message: "Infrator não encontrado"})
            }

            response.json(offender)
        } catch (error) {
            next(error)
        }

    }
}