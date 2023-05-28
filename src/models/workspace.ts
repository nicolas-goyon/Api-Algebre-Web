import { Generated } from "kysely";
import { db, executeSQL } from "../rooter/database";
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */
// FIXME : Depreciated

export interface workspace {
    id: Generated<number>;
    id_user: number;
    workspace_content: JSON;
    name: string;
    id_exercice: number | null;
}

export class Workspace {

    public static readonly table_name = "workspace";

    private _id: number | null;
    private _id_user: number;
    private _workspace_content: JSON;
    private _name: string;
    private _id_exercice: number | null;

    constructor(id: number | null, id_user: number, workspace_content: JSON, name: string, id_exercice: number | null = null) {
        this._id = id
        this._id_user = id_user
        this._workspace_content = workspace_content
        this._name = name
        this._id_exercice = id_exercice
    }

    public get id(): number | null {
        return this._id;
    }
    private set id(value: number | null) {
        this._id = value;
    }

    public get id_user(): number {
        return this._id_user;
    }
    private set id_user(value: number) {
        this._id_user = value;
    }

    public get workspace_content(): JSON {
        return this._workspace_content;
    }
    public set workspace_content(value: JSON) {
        this._workspace_content = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get id_exercice(): number | null {
        return this._id_exercice;
    }

    public set id_exercice(value: number | null) {
        this._id_exercice = value;
    }



    public async save() {
        if (this.id === null) {
            const result = await db
                .insertInto(Workspace.table_name)
                .values({
                    id_user: this.id_user,
                    workspace_content: this.workspace_content,
                    name: this.name,
                    id_exercice: this.id_exercice
                })
                .returning('id')
                .executeTakeFirst();
            if (result === null || result === undefined) {
                throw new Error('Insert failed');
            }
            this.id = result.id;
        } else {
            await db
                .updateTable(Workspace.table_name)
                .set({
                    id_user: this.id_user,
                    workspace_content: this.workspace_content,
                    name: this.name,
                    id_exercice: this.id_exercice
                })
                .where('id', '=', this.id)
                .execute();
        }
    }

    public async insert() {
        const result = await db
            .insertInto(Workspace.table_name)
            .values({
                id_user: this.id_user,
                workspace_content: this.workspace_content,
                name: this.name,
                id_exercice: this.id_exercice
            })
            .returning('id')
            .executeTakeFirst();
        if (result === null || result === undefined) {
            throw new Error('Insert failed');
        }
        // if result.id is null, try to get the id of the last inserted row
        if (result.id === null) {
            const lastInserted = await db
                .selectFrom(Workspace.table_name)
                .selectAll()
                .orderBy('id', 'desc')
                .executeTakeFirst();
            if (lastInserted === null || lastInserted === undefined) {
                throw new Error('Insert failed');
            }
            this.id = lastInserted.id;
        }
        else
            this.id = result.id;
        console.log("Workspace inserted with id : " + this.id);
    }

    public async delete() {
        if (this.id !== null) {
            await db
                .deleteFrom(Workspace.table_name)
                .where('id', '=', this.id)
                .execute();
        }
    }

    public static async findById(id: number): Promise<Workspace | null> {
        const result = await db
            .selectFrom(Workspace.table_name)
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();

        if (result === null || result === undefined) {
            return null;
        }
        return new Workspace(
            result.id,
            result.id_user,
            result.workspace_content,
            result.name
        );
    }

    public static async findAll(): Promise<Workspace[]> {
        const result = await db.selectFrom(Workspace.table_name).selectAll().execute();
        return result.map((row) => {
            return new Workspace(
                row.id,
                row.id_user,
                row.workspace_content,
                row.name,
                row.id_exercice
            );
        });
    }

    public static async getWorkspacesByIdUser(id_user: number): Promise<Workspace[]> {
        const result = await db
            .selectFrom(Workspace.table_name)
            .where('id_user', '=', id_user)
            .selectAll()
            .execute();
        return result.map((row) => {
            return new Workspace(
                row.id,
                row.id_user,
                row.workspace_content,
                row.name,
                row.id_exercice
            );
        });
    }

    public static async getWorkspaceByUserIdAndId(id_user: number, id: number): Promise<Workspace | null> {
        const result = await db
            .selectFrom(Workspace.table_name)
            .where('id_user', '=', id_user)
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst();

        if (result === null || result === undefined) {
            return null;
        }
        return new Workspace(
            result.id,
            result.id_user,
            result.workspace_content,
            result.name,
            result.id_exercice
        );
    }

    public static async getWorkspaceByUserIdAndExerciceId(id_user: number, id_exercice: number): Promise<Workspace | null> {
        const result = await db
            .selectFrom(Workspace.table_name)
            .where('id_user', '=', id_user)
            .where('id_exercice', '=', id_exercice)
            .selectAll()
            .executeTakeFirst();

        if (result === null || result === undefined) {
            return null;
        }
        return new Workspace(
            result.id,
            result.id_user,
            result.workspace_content,
            result.name,
            result.id_exercice
        );
    }
}