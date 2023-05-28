import { Generated } from 'kysely';
import {db} from '../rooter/database';

export interface exercice {
    id: Generated<number>;
    id_user: number;
    name: string;
    enonce: string;
}

export class Exercice {
    public static readonly table_name = 'exercice';

    public _id: number;
    private _id_user: number;
    private _name: string;
    private _enonce: string;

    constructor(id: number, id_user: number, name: string, enonce: string) {
        this._id = id;
        this._id_user = id_user;
        this._name = name;
        this._enonce = enonce;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public set id_super(value: number) {
        this._id = value;
    }

    public get id_user(): number {
        return this._id_user;
    }
    private set id_user(value: number) {
        this._id_user = value;
    }

    public get name(): string {
        return this._name;
    }
    private set name(value: string) {
        this._name = value;
    }

    public get enonce(): string {
        return this._enonce;
    }
    private set enonce(value: string) {
        this._enonce = value;
    }

    public static async create(id_user: number, name: string, enonce: string): Promise<Exercice> {
        const res = await db
            .insertInto(Exercice.table_name)
            .values({id_user: id_user, name: name, enonce: enonce})
            .returningAll()
            .executeTakeFirst();

        if (res === null || res === undefined) {
            throw new Error('Failed to create exercice');
        }
        if (res.id === null || res.id === undefined) {
            // select last_insert_id() as id
            const res2 = await db
                .selectFrom(Exercice.table_name)
                .selectAll()
                .orderBy('id', 'desc')
                .executeTakeFirst();
            if (res2 === null || res2 === undefined) {
                throw new Error('Failed to create exercice');
            }
            return new Exercice(res2.id, id_user, name, enonce);
        }
        return new Exercice(res.id, id_user, name, enonce);
    }

    public static async getAllExercices(): Promise<Exercice[]> {
        const res = await db
            .selectFrom(Exercice.table_name)
            .selectAll()
            .execute();

        if (res === null || res === undefined) {
            throw new Error('Failed to get all exercices');
        }
        return res.map((e) => new Exercice(e.id, e.id_user, e.name, e.enonce));
    }

    public static async getExerciceById(id: number): Promise<Exercice | null> {
        const res = await db
            .selectFrom(Exercice.table_name)
            .selectAll()
            .where('id', '=', id)
            .executeTakeFirst();

        if (res === null || res === undefined) {
            return null;
        }
        return new Exercice(res.id, res.id_user, res.name, res.enonce);
    }

    public static async getExercicesByIdUser(id_user: number): Promise<Exercice[]> {
        const res = await db
            .selectFrom(Exercice.table_name)
            .selectAll()
            .where('id_user', '=', id_user)
            .execute();

        if (res === null || res === undefined) {
            throw new Error('Failed to get exercices by id_user');
        }
        return res.map((e) => new Exercice(e.id, e.id_user, e.name, e.enonce));
    }

    public async save(): Promise<void> {
        await db
            .updateTable(Exercice.table_name)
            .set({name: this.name, enonce: this.enonce})
            .where('id', '=', this.id)
            .execute();
    }

    public async delete(): Promise<void> {
        await db
            .deleteFrom(Exercice.table_name)
            .where('id', '=', this.id)
            .execute();
    }

}

