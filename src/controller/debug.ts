import { db, executeSQL } from "../rooter/database";
import express from "express";
import { test_table, testTable } from "../models";
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
    if (deleteLine.length === 0){
        res.status(500);
        res.json({error: "Line not found"})
    }
    else {
        res.status(200);
        res.json(query);
    }
});

router.get('/updateLineById/:id/:pass', async (req, res) => {
    let updateLine = await testTable.getLineById(Number(req.params.id));
    if(updateLine !== null){
        updateLine.setPassword(req.params.pass);
        await updateLine.save();
        res.status(200);
        res.json(updateLine);
    }
    else {
        res.status(500);
        res.json({error: "Line not found"})
    }
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
