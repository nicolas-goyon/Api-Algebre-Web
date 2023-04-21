import { Generated } from "kysely";
import { db, executeSQL, getShema } from "../rooter/database";

export interface test_table {
    id: Generated<number>
    password: String
    create_date: Generated<String>
}
  
export const getDataBaseInfo = async () => {
    return getShema();
};

export const testBuilder =async () => {
    
    let query = await db
        .insertInto('test_table')
        .values({ password : "dazdadaz" })
        // .execute()
    console.log(query)


    let query2 = await db
        .selectFrom('test_table')
        // .where('gender', '=', 'female')
        .selectAll()
        .compile()
    console.log(query2.sql+ ";")
    let result =  await executeSQL(query2.sql + ";", [])
    // const result = query.execute()
    return result;
}

class testTable {
    public static readonly table_name = "test_table";

    private id : number;
    private password: String;
    private create_date: String;

    constructor(id:number | null) {
        this.id = -1
        this.password = ""
        this.create_date = ""
        if(id !== null){
            let data = testTable.getDataLineById(id);
            this.id = id;
            this.password = data.password;
            this.create_date = data.create_date;
        }
    }

    public static getLineById(id:number): testTable{
        return new testTable(id);
    }

    public static getDataLineById(id:number): {id:number,password: string,create_date: string} {
        let result = {id:-1, password: "", create_date: ""};
        let dbresult = db
            .selectFrom(testTable.table_name)
            .where('id', '=', id)
            .selectAll()
            .executeTakeFirst
        if (dbresult !== undefined)
            result = dbresult;
        return result;
    }
}