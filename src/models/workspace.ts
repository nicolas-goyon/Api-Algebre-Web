import { Generated } from "kysely";
import { db, executeSQL } from "../rooter/database";
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */


export interface workspace {
    id: Generated<number>;
    id_user: number;
    workspace_content: JSON;
}

export class Workspace {
    
    public static readonly table_name = "workspace";

    private _id : number | null;
    private _id_user: number;
    private _workspace_content: JSON;
    
    constructor(id:number | null, id_user: number, workspace_content: JSON){
        this._id = id
        this._id_user = id_user
        this._workspace_content = workspace_content
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




    public async save(){
        if(this.id === null){
            const result = await db
            .insertInto(Workspace.table_name)
            .values({
                id_user: this.id_user,
                workspace_content: this.workspace_content
            })
            .returning('id')
            .executeTakeFirst();
            if (result === null || result === undefined) {
                throw new Error('Insert failed');
            }
            this.id = result.id;
        }else{
            await db
            .updateTable(Workspace.table_name)
            .set({
                id_user: this.id_user,
                workspace_content: this.workspace_content
            })
            .where('id', '=', this.id)
            .execute();
        }
    }

    public async delete(){
        if(this.id !== null){
            await db
            .deleteFrom(Workspace.table_name)
            .where('id', '=', this.id)
            .execute();
        }
    }

    public static async findById(id: number): Promise<Workspace | null>{
        const result = await db
        .selectFrom(Workspace.table_name)
        .where('id', '=', id)
        .selectAll()
        .executeTakeFirst();

        if(result === null || result === undefined){
            return null;
        }
        return new Workspace(
            result.id,
            result.id_user,
            result.workspace_content
        );
    }

    public static async findAll(): Promise<Workspace[]>{
        const result = await db.selectFrom(Workspace.table_name).selectAll().execute();
        return result.map((row) => {
            return new Workspace(
                row.id,
                row.id_user,
                row.workspace_content
            );
        });
    }

    public static async getWorkspacesByIdUser(id_user: number): Promise<Workspace[]>{
        const result = await db
        .selectFrom(Workspace.table_name)
        .where('id_user', '=', id_user)
        .selectAll()
        .execute();
        return result.map((row) => {
            return new Workspace(
                row.id,
                row.id_user,
                row.workspace_content
            );
        });
    }

    public static async createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS ${Workspace.table_name} (
            id SERIAL PRIMARY KEY,
            id_user INTEGER NOT NULL,
            workspace_content JSON NOT NULL
        );
        `;
        await executeSQL(sql);
    }

    public static async getAllWorkspaces(): Promise<Workspace[]>{
        const result = await db
        .selectFrom(Workspace.table_name)
        .selectAll()
        .execute();
        return result.map((row) => {
            return new Workspace(
                row.id,
                row.id_user,
                row.workspace_content
            );
        });
    }
}