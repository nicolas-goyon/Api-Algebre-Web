-- Make the following database:
-- Already existing : utilisateur(id, pseudo, create_date, email, password), connection(token, id_user, date)
-- need to do :
-- A table that will be the interface for two tables : Workspace(id_super, workspace_content, name) : id_super is the primary key and Exercice(id_super, name, enonce) id_super is the primary key & solution of exercice corresponding to the "relation" named ExerciceSolution
-- A table relation(id_interface, name, content) id_interface and name are the primary key
-- The participation to an exercice is represented by a change in workspace : the workspace store the id of the exercice (can be null) make sure that max one exercice by user is stored in the database
-- The interface needs an id that auto increment, a type that is either "workspace" or "exercice" and the user id that created it
-- When creating a workspace, or an exercice, it needs to create an interface with the id of the workspace or exercice, the type and the user id
-- The interface needs to be hidden from requests
-- The interface needs to be deleted when the workspace or exercice is deleted
-- the relation content is represented as a csv content

-- DROP TABLES 
DROP TABLE IF EXISTS InterfaceWE CASCADE;
DROP TABLE IF EXISTS ExerciceData CASCADE;
DROP TABLE IF EXISTS WorkspaceData CASCADE;
DROP TABLE IF EXISTS Relation CASCADE;
DROP TABLE IF EXISTS Exercice CASCADE;
DROP TABLE IF EXISTS Workspace CASCADE;
DROP VIEW IF EXISTS Workspace CASCADE;
DROP VIEW IF EXISTS Exercice CASCADE;
DROP TRIGGER IF EXISTS WorkspaceDataInsert ON Workspace;
DROP TRIGGER IF EXISTS ExerciceInsert ON Exercice;
DROP TRIGGER IF EXISTS WorkspaceDataUpdate ON Workspace;
DROP TRIGGER IF EXISTS ExerciceUpdate ON Exercice;
DROP TRIGGER IF EXISTS WorkspaceDataDelete ON Workspace;
DROP TRIGGER IF EXISTS ExerciceDelete ON Exercice;

-- DROP FUNCTION
DROP FUNCTION IF EXISTS WorkspaceDataInsertFunction();
DROP FUNCTION IF EXISTS ExerciceInsertFunction();
DROP FUNCTION IF EXISTS WorkspaceDataUpdateFunction();
DROP FUNCTION IF EXISTS ExerciceUpdateFunction();
DROP FUNCTION IF EXISTS WorkspaceDataDeleteFunction();
DROP FUNCTION IF EXISTS ExerciceDeleteFunction();




-- Interface 
CREATE TABLE InterfaceWE (
    id SERIAL NOT NULL,
    typeI VARCHAR(255) NOT NULL,
    id_user INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (id),
    UNIQUE (id , typeI),
    UNIQUE (id , id_user),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id),
    CHECK (typeI IN ('workspace', 'exercice'))
);




-- EXERCICE
CREATE TABLE ExerciceData (
    id_super INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    typeI VARCHAR(255) NOT NULL DEFAULT 'exercice' CHECK (typeI = 'exercice'),
    enonce TEXT NOT NULL,
    PRIMARY KEY (id_super),
    UNIQUE (id_super),
    FOREIGN KEY (id_super, typeI) REFERENCES InterfaceWE(id, typeI)
);


-- WORKSPACE
CREATE TABLE WorkspaceData (
    id_super INT NOT NULL,
    typeI VARCHAR(255) NOT NULL DEFAULT 'workspace' CHECK (typeI = 'workspace'),
    id_user INT NOT NULL, -- make sure that the user is the same as the one that created the interface
    name VARCHAR(255) NOT NULL,
    workspace_content TEXT NOT NULL,
    id_exercice INT,
    PRIMARY KEY (id_super),
    UNIQUE (id_super),
    UNIQUE (id_user, id_exercice), -- make sure that max one exercice by user is stored in the database
    FOREIGN KEY (id_super, typeI) REFERENCES InterfaceWE(id, typeI),
    FOREIGN KEY (id_user) REFERENCES utilisateur(id),
    FOREIGN KEY (id_super, id_user) REFERENCES InterfaceWE(id, id_user),
    FOREIGN KEY (id_exercice) REFERENCES ExerciceData(id_super)
);


-- RELATION
CREATE TABLE Relation (
    id_interface INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id_interface, name),
    UNIQUE (id_interface, name),
    FOREIGN KEY (id_interface) REFERENCES InterfaceWE(id)
);

-- View that represemble simplier a workspace
CREATE VIEW Workspace AS
    SELECT id_super AS id, id_user, name, workspace_content, id_exercice FROM WorkspaceData;

-- View that represemble simplier an exercice
CREATE VIEW Exercice AS
    SELECT id_super AS id, id_user, name, enonce FROM ExerciceData JOIN interfaceWE ON id_super = id AND interfaceWE.typeI = 'exercice';

-- Trigger when inserting a workspace to create an interface
CREATE OR REPLACE FUNCTION WorkspaceDataInsertFunction()
    RETURNS TRIGGER AS $$
    DECLARE 
        id_super INT;
    BEGIN
        INSERT INTO InterfaceWE (typeI, id_user) VALUES ('workspace', NEW.id_user) RETURNING id INTO id_super;
        INSERT INTO WorkspaceData (id_super, typeI, id_user, name, workspace_content, id_exercice) VALUES (id_super, 'workspace', NEW.id_user, NEW.name, NEW.workspace_content, NEW.id_exercice);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER WorkspaceDataInsert
    INSTEAD OF INSERT ON Workspace
    FOR EACH ROW
    EXECUTE FUNCTION WorkspaceDataInsertFunction();


-- Trigger when inserting an exercice to create an interface
CREATE OR REPLACE FUNCTION ExerciceInsertFunction()
    RETURNS TRIGGER AS $$
    DECLARE 
        id_super INT;
    BEGIN
        INSERT INTO InterfaceWE (typeI, id_user) VALUES ('exercice', NEW.id_user) RETURNING id INTO id_super;
        INSERT INTO ExerciceData (id_super, typeI, name, enonce) VALUES (id_super, 'exercice', NEW.name, NEW.enonce);
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ExerciceInsert
    INSTEAD OF INSERT ON Exercice
    FOR EACH ROW
    EXECUTE FUNCTION ExerciceInsertFunction();


-- Trigger when updating a workspace to update the interface
CREATE OR REPLACE FUNCTION WorkspaceDataUpdateFunction()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE WorkspaceData SET name = NEW.name, workspace_content = NEW.workspace_content, id_exercice = NEW.id_exercice WHERE id_super = NEW.id;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER WorkspaceDataUpdate
    INSTEAD OF UPDATE ON Workspace
    FOR EACH ROW
    EXECUTE FUNCTION WorkspaceDataUpdateFunction();



-- Trigger when updating an exercice to update the interface
CREATE OR REPLACE FUNCTION ExerciceUpdateFunction()
    RETURNS TRIGGER AS $$
    BEGIN
        UPDATE ExerciceData SET name = NEW.name, enonce = NEW.enonce WHERE id_super = NEW.id;
        RETURN NEW;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ExerciceUpdate
    INSTEAD OF UPDATE ON Exercice
    FOR EACH ROW
    EXECUTE FUNCTION ExerciceUpdateFunction();


CREATE OR REPLACE FUNCTION WorkspaceDataDeleteFunction()
    RETURNS TRIGGER AS $$
    BEGIN
        DELETE FROM WorkspaceData WHERE id_super = OLD.id;
        -- Delete all relations that are linked to the workspace
        DELETE FROM Relation WHERE id_interface = OLD.id;
        DELETE FROM InterfaceWE WHERE id = OLD.id;
        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER WorkspaceDataDelete
    INSTEAD OF DELETE ON Workspace
    FOR EACH ROW
    EXECUTE FUNCTION WorkspaceDataDeleteFunction();


-- Trigger when deleting an exercice to delete the interface
CREATE OR REPLACE FUNCTION ExerciceDeleteFunction()
    RETURNS TRIGGER AS $$
    BEGIN
        DELETE FROM workspace WHERE id_exercice = OLD.id;
        DELETE FROM ExerciceData WHERE id_super = OLD.id;
        -- Delete all relations that are linked to the workspace
        DELETE FROM Relation WHERE id_interface = OLD.id;
        DELETE FROM InterfaceWE WHERE id = OLD.id;
        RETURN OLD;
    END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ExerciceDelete
    INSTEAD OF DELETE ON Exercice
    FOR EACH ROW
    EXECUTE FUNCTION ExerciceDeleteFunction();




-- Utilisateur(id, pseudo, password, email, create_date)
-- CREATE TABLE Utilisateur (
--     id SERIAL NOT NULL,
--     pseudo VARCHAR(255) NOT NULL,
--     password TEXT NOT NULL,
--     email VARCHAR(255) NOT NULL,
--     create_date TIMESTAMP NOT NULL,
--     PRIMARY KEY (id),
--     UNIQUE (id),
--     UNIQUE (pseudo),
--     UNIQUE (email)
-- );

-- connexionToken(id, token, id_user, date)
-- CREATE TABLE ConnexionToken (
--     id SERIAL NOT NULL,
--     token TEXT NOT NULL,
--     id_user INT NOT NULL,
--     date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
--     PRIMARY KEY (id),
--     UNIQUE (id),
--     UNIQUE (token),
--     FOREIGN KEY (id_user) REFERENCES utilisateur(id)
-- );

/*
https://erd.dbdesigner.net/designer/schema/1684075165-untitled
utilisateur {
	id serial pk
	pseudo varchar
	password text
	email varchar
	create_date timestamp
}

connexiontoken {
	id serial pk
	token text
	id_user int > utilisateur.id
	date timestamp def(current_timestamp)
}

interfacewe {
	id serial pk
	typeI varchar
	id_user int > utilisateur.id
}

relation {
	id_interface int pk > interfacewe.id
	name varchar pk
	content text
}

exercice {
	id_super integer pk > interfacewe.id
	name varchar
	typeI varchar > interfacewe.typeI
	ennonce text
}

workspace {
	id_super integer pk unique > interfacewe.id
	typeI varchar > interfacewe.typeI
	id_user integer unique > interface.id_user
	workspace_content text
	id_exercice integer > exercice.id_super
}


*/