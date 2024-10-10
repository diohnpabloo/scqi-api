import { Request, Response, NextFunction } from "express";
import { knex } from "../../database/knex";
import { DiskStorage } from "@/providers/DiskStorage";
import { AppError } from "@/utils/AppError";

export class OffenderController {
    async create(request: Request, response: Response, next: NextFunction) {
        const diskstorage = new DiskStorage()

        try {

            let { cpf, name, surname, mother_name, date_of_birth } = request.body
            const avatarFileName = request.file?.filename
            const filename = avatarFileName ? await diskstorage.saveFile(avatarFileName) : null

            const offenders = await knex("offenders").where({ cpf }).first()

            if (offenders) {
                throw new AppError("Infrator já cadastrado na base de dados.")
            }

            await knex("offenders").insert({
                cpf,
                name,
                surname,
                mother_name,
                date_of_birth,
                avatar: filename
            })

            response.status(201).json()
        } catch (error) {
            const filename = request.file?.filename

            if (filename) {
                await diskstorage.deleteFile(filename)
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