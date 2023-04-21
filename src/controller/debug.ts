import { Generated } from "kysely";
import { db, executeSQL } from "../rooter/database";
import express from "express";
export const router = express.Router();
// Route : /debug
/* -------------------------------------------------------------------------- */
/*                                   ROUTER                                   */
/* -------------------------------------------------------------------------- */

router.get('/getAllLines', async (req, res) => {
    
    let query = await db
        .selectFrom(testTable.table_name)
        .selectAll()
        .execute()
    res.json(query);
  
});
  
  
router.get('/addLine/:pass', async (req, res) => {
    
    let add = await db
        .insertInto(testTable.table_name)
        .values({ password : req.params.pass })
        .execute()
    let query = await db
        .selectFrom(testTable.table_name)
        .selectAll()
        .execute()
    res.json(query);
  
});

router.get('/getLineById/:id', async (req, res) => {
    let query = await testTable.getLineById(Number(req.params.id));
    res.json(query);
});

router.get('/deleteLineById/:id', async (req, res) => {
    let deleteLine = await db
        .deleteFrom(testTable.table_name)
        .where('id', '=', Number(req.params.id))
        .execute()
    let query = await db
        .selectFrom(testTable.table_name)
        .selectAll()
        .execute()
    res.json(query);
});

/* -------------------------------------------------------------------------- */
/*                                 FIN ROUTER                                 */
/* -------------------------------------------------------------------------- */


/* -------------------------------------------------------------------------- */
/*                                CREATE TABLE                                */
/* -------------------------------------------------------------------------- */


router.get('/createTable', async (req, res) => {
    let sqlQuery = ''
        + 'CREATE TABLE "'+ testTable.table_name +'" (';
            + '"id" SERIAL PRIMARY KEY,';
            + '"password" VARCHAR(255) NOT NULL,';
            + '"create_date" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP';
        + ');';
    let query = await executeSQL(sqlQuery,[]);
    res.json(query);
});

/* -------------------------------------------------------------------------- */
/*                              FIN CREATE TABLE                              */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */


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
                .execute()
            this.id = result.insertId
        } else {
            await db
                .update(testTable.table_name)
                .set({ password: this.password })
                .where('id', '=', this.id)
                .execute()
        }
    }
}

/* -------------------------------------------------------------------------- */
/*                                  FIN CLASS                                 */
/* -------------------------------------------------------------------------- */