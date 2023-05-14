import { db, executeSQL } from "../rooter/database";
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */
// FIXME : Depreciated

export interface relation {
    id_interface: number; // UNIQUE(id_interface, name)
    name: string; // UNIQUE(id_interface, name)
    content: string; // string csv
}

export class Relation {
    public static readonly table_name = "relation";

    private _id_interface : number;
    private _name : string;
    private _content : string; // string csv

    constructor(id_interface:number, name: string, content: string){
        this._id_interface = id_interface
        this._name = name
        this._content = content
    }

    public get id_interface(): number {
        return this._id_interface;
    }
    private set id_interface(value: number) {
        this._id_interface = value;
    }

    public get name(): string {
        return this._name;
    }
    private set name(value: string) {
        this._name = value;
    }

    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
    }

    public async save(){
        // try to insert, if fail try to update
        try {
            await db
            .insertInto(Relation.table_name)
            .values({ id_interface: this.id_interface, name: this.name, content: this.content })
            .execute();
        }
        catch (e) {
            await db
            .updateTable(Relation.table_name)
            .set({ content: this.content })
            .where('id_interface', '=', this.id_interface)
            .where('name', '=', this.name)
            .execute(); // TODO : Check if it's working
        }
        
    }

    public async delete(){
        await db
        .deleteFrom(Relation.table_name)
        .where('id_interface', '=', this.id_interface)
        .where('name', '=', this.name)
        .execute();
    }

    public async changeName(new_name: string){
        await db
        .updateTable(Relation.table_name)
        .set({ name: new_name })
        .where('id_interface', '=', this.id_interface)
        .where('name', '=', this.name)
        .execute(); // TODO : Check if it's working
        this.name = new_name;
    }

    public static async get(id_interface:number, name:string): Promise<Relation | null>{
        const result = await db
        .selectFrom(Relation.table_name)
        .selectAll()
        .where('id_interface', '=', id_interface)
        .where('name', '=', name)
        .executeTakeFirst();
        if(result === null || result === undefined){
            return null;
        }
        return new Relation(result.id_interface, result.name, result.content);
    }

    public static async getAll(): Promise<Relation[]>{
        const result = await db
        .selectFrom(Relation.table_name)
        .selectAll()
        .execute();
        let relations: Relation[] = [];
        for (let i = 0; i < result.length; i++) {
            relations.push(new Relation(result[i].id_interface, result[i].name, result[i].content));
        }
        return relations;
    }

    public static async getAllByInterface(id_interface:number): Promise<Relation[]>{
        const result = await db
        .selectFrom(Relation.table_name)
        .selectAll()
        .where('id_interface', '=', id_interface)
        .execute();
        let relations: Relation[] = [];
        for (let i = 0; i < result.length; i++) {
            relations.push(new Relation(result[i].id_interface, result[i].name, result[i].content));
        }
        return relations;
    }
}