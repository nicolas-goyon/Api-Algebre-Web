import { db, executeSQL } from "../rooter/database";
import express from "express";
import { testTable } from "../models";
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
    let newLine = new testTable(null, req.params.pass, null);
    await newLine.save();
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
    let deleteLine = await testTable.getLineById(Number(req.params.id));
    if(deleteLine !== null){
        await deleteLine.delete();
        res.status(200);
        res.json({success: "Line deleted"});
    }
    else {
        res.status(500);
        res.json({error: "Line not found"})
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


router.get('/resetTables', async (req, res) => {
    let sqlQuery = "DROP TABLE IF EXISTS InterfaceWE CASCADE;    DROP TABLE IF EXISTS ExerciceData CASCADE;    DROP TABLE IF EXISTS WorkspaceData CASCADE;    DROP TABLE IF EXISTS Relation CASCADE;    DROP TABLE IF EXISTS Exercice CASCADE;    DROP TABLE IF EXISTS Workspace CASCADE;    DROP VIEW IF EXISTS Workspace CASCADE;    DROP VIEW IF EXISTS Exercice CASCADE;    DROP TRIGGER IF EXISTS WorkspaceDataInsert ON Workspace;    DROP TRIGGER IF EXISTS ExerciceInsert ON Exercice;    DROP TRIGGER IF EXISTS WorkspaceDataUpdate ON Workspace;    DROP TRIGGER IF EXISTS ExerciceUpdate ON Exercice;    DROP TRIGGER IF EXISTS WorkspaceDataDelete ON Workspace;    DROP TRIGGER IF EXISTS ExerciceDelete ON Exercice;                CREATE TABLE InterfaceWE (        id SERIAL NOT NULL,        typeI VARCHAR(255) NOT NULL,        id_user INT NOT NULL,        PRIMARY KEY (id),        UNIQUE (id),        UNIQUE (id , typeI),        UNIQUE (id , id_user),        FOREIGN KEY (id_user) REFERENCES utilisateur(id),        CHECK (typeI IN ('workspace', 'exercice'))    );                    CREATE TABLE ExerciceData (        id_super INT NOT NULL,        name VARCHAR(255) NOT NULL,        typeI VARCHAR(255) NOT NULL DEFAULT 'exercice' CHECK (typeI = 'exercice'),        enonce TEXT NOT NULL,        PRIMARY KEY (id_super),        UNIQUE (id_super),        FOREIGN KEY (id_super, typeI) REFERENCES InterfaceWE(id, typeI)    );            CREATE TABLE WorkspaceData (        id_super INT NOT NULL,        typeI VARCHAR(255) NOT NULL DEFAULT 'workspace' CHECK (typeI = 'workspace'),        id_user INT NOT NULL,        name VARCHAR(255) NOT NULL,        workspace_content TEXT NOT NULL,        id_exercice INT,        PRIMARY KEY (id_super),        UNIQUE (id_super),        UNIQUE (id_user, id_exercice),         FOREIGN KEY (id_super, typeI) REFERENCES InterfaceWE(id, typeI),        FOREIGN KEY (id_user) REFERENCES utilisateur(id),        FOREIGN KEY (id_super, id_user) REFERENCES InterfaceWE(id, id_user),        FOREIGN KEY (id_exercice) REFERENCES ExerciceData(id_super)    );            CREATE TABLE Relation (        id_interface INT NOT NULL,        name VARCHAR(255) NOT NULL,        content TEXT NOT NULL,        PRIMARY KEY (id_interface, name),        UNIQUE (id_interface, name),        FOREIGN KEY (id_interface) REFERENCES InterfaceWE(id)    );        CREATE VIEW Workspace AS        SELECT id_super AS id, id_user, name, workspace_content, id_exercice FROM WorkspaceData;        CREATE VIEW Exercice AS        SELECT id_super AS id, id_user, name, enonce FROM ExerciceData JOIN interfaceWE ON id_super = id AND interfaceWE.typeI = 'exercice';        CREATE OR REPLACE FUNCTION WorkspaceDataInsertFunction()        RETURNS TRIGGER AS $$        DECLARE             id_super INT;        BEGIN            INSERT INTO InterfaceWE (typeI, id_user) VALUES ('workspace', NEW.id_user) RETURNING id INTO id_super;            INSERT INTO WorkspaceData (id_super, typeI, id_user, name, workspace_content, id_exercice) VALUES (id_super, 'workspace', NEW.id_user, NEW.name, NEW.workspace_content, NEW.id_exercice);            RETURN NEW;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER WorkspaceDataInsert        INSTEAD OF INSERT ON Workspace        FOR EACH ROW        EXECUTE FUNCTION WorkspaceDataInsertFunction();            CREATE OR REPLACE FUNCTION ExerciceInsertFunction()        RETURNS TRIGGER AS $$        DECLARE             id_super INT;        BEGIN            INSERT INTO InterfaceWE (typeI, id_user) VALUES ('exercice', NEW.id_user) RETURNING id INTO id_super;            INSERT INTO ExerciceData (id_super, typeI, name, enonce) VALUES (id_super, 'exercice', NEW.name, NEW.enonce);            RETURN NEW;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER ExerciceInsert        INSTEAD OF INSERT ON Exercice        FOR EACH ROW        EXECUTE FUNCTION ExerciceInsertFunction();            CREATE OR REPLACE FUNCTION WorkspaceDataUpdateFunction()        RETURNS TRIGGER AS $$        BEGIN            UPDATE WorkspaceData SET name = NEW.name, workspace_content = NEW.workspace_content, id_exercice = NEW.id_exercice WHERE id_super = NEW.id;            RETURN NEW;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER WorkspaceDataUpdate        INSTEAD OF UPDATE ON Workspace        FOR EACH ROW        EXECUTE FUNCTION WorkspaceDataUpdateFunction();                CREATE OR REPLACE FUNCTION ExerciceUpdateFunction()        RETURNS TRIGGER AS $$        BEGIN            UPDATE ExerciceData SET name = NEW.name, enonce = NEW.enonce WHERE id_super = NEW.id;            RETURN NEW;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER ExerciceUpdate        INSTEAD OF UPDATE ON Exercice        FOR EACH ROW        EXECUTE FUNCTION ExerciceUpdateFunction();            CREATE OR REPLACE FUNCTION WorkspaceDataDeleteFunction()        RETURNS TRIGGER AS $$        BEGIN            DELETE FROM InterfaceWE WHERE id = OLD.id;            DELETE FROM WorkspaceData WHERE id_super = OLD.id;            RETURN OLD;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER WorkspaceDataDelete        INSTEAD OF DELETE ON Workspace        FOR EACH ROW        EXECUTE FUNCTION WorkspaceDataDeleteFunction();            CREATE OR REPLACE FUNCTION ExerciceDeleteFunction()        RETURNS TRIGGER AS $$        BEGIN            DELETE FROM InterfaceWE WHERE id = OLD.id;            DELETE FROM ExerciceData WHERE id_super = OLD.id;            RETURN OLD;        END;    $$ LANGUAGE plpgsql;    CREATE TRIGGER ExerciceDelete        INSTEAD OF DELETE ON Exercice        FOR EACH ROW        EXECUTE FUNCTION ExerciceDeleteFunction();        "
    let query = await executeSQL(sqlQuery,[]);
    console.log(query)
    res.json(query);
});
/* -------------------------------------------------------------------------- */
/*                              FIN CREATE TABLE                              */
/* -------------------------------------------------------------------------- */
