
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */
import { Generated } from "kysely";
import { db } from "../rooter/database";


export interface test_table {
    id: Generated<number>
    password: String
    create_date: Generated<String>
}


export class testTable {
    public static readonly table_name = "test_table";

    private id : number | null;
    private password: String;
    private create_date: String | null;

    constructor(id:number | null, password: String, create_date: String | null){
        this.id = id
        this.password = password
        this.create_date = create_date
    }

    public setPassword(password: String){
        this.password = password;
    }

    public static async getLineById(id:number): Promise<testTable|null>{
        const data = await testTable.getDataLineById(id);
        if (data !== undefined)
            return new testTable(id, data.password, data.create_date);
        return null;
    }

    public static async getDataLineById(id:number): Promise<{ password: String, id: number, create_date: String; } | undefined> {
        let dbresult = await db
            .selectFrom(testTable.table_name)
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst()
        return dbresult;
    }

    public async save() {
        if (this.id === null) {
            const result = await db
                .insertInto(testTable.table_name)
                .values({ password: this.password })
                .returning(['id', 'create_date'])
                .executeTakeFirst()
            if(result !== undefined){
                this.id = result.id
                this.create_date = result.create_date
            }
        } else {
            await db
                .updateTable(testTable.table_name)
                .set({ password: this.password })
                .where('id', '=', this.id)
                .execute()
        }
    }

    public async delete() {
        await db
            .deleteFrom(testTable.table_name)
            .where('id', '=', this.id)
            .execute()
    }
}

/* -------------------------------------------------------------------------- */
/*                                  FIN CLASS                                 */
/* -------------------------------------------------------------------------- */