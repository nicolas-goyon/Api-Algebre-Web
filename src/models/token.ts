import { Generated } from "kysely";
import { db, executeSQL } from "../rooter/database";
import { Utilisateur } from "./utilisateur";
import jwt from "jsonwebtoken";
import {v4 as uuidv4} from "uuid";
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */


export interface connexionToken {
    id : Generated<number>;
    token : String;
    user_id : number;
    create_date : Generated<string>;
}

export class Token {
    public static readonly table_name = "connexiontoken";
    private id : number | null;
    private token : String;
    private user_id : number;
    private create_date : string | null;

    constructor(id : number | null, token : string | String, user_id : number, create_date : string | null) {
        this.id = id;
        this.token = token;
        this.user_id = user_id;
        this.create_date = create_date;
    }

    public getId() : number | null {
        return this.id;
    }

    public getToken() : String {
        return this.token;
    }

    public getUser_id() : number {
        return this.user_id;
    }

    public getCreate_date() : string | null {
        return this.create_date;
    }

    public async getUser(){
        return await Utilisateur.getUtilisateurById(this.user_id);
    }

    public static async getTokenByToken(token : string) : Promise<Token | null> {
        const result = await db
            .selectFrom(Token.table_name)
            .where( "token", "=", token)
            .selectAll()
            .executeTakeFirstOrThrow();
        return new Token(result.id, result.token, result.user_id, result.create_date);
    }

    public static async generateToken(user_id : number) : Promise<Token> {
        const tokenId = uuidv4();
        const token = jwt.sign({ sub: user_id, jti: tokenId }, process.env.JWT_SECRET || "secret");
        const result = await db
            .insertInto(Token.table_name)
            .values({ token, user_id })
            .returning(['id', 'create_date'])
            .executeTakeFirstOrThrow();
        return new Token(result.id, token, user_id, result.create_date);
    }

    public static async createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS ${Token.table_name} (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) NOT NULL UNIQUE,
                user_id INTEGER NOT NULL REFERENCES ${Utilisateur.table_name}(id),
                create_date TIMESTAMP NOT NULL DEFAULT NOW()
            );
        `;
        const res = await executeSQL(sql, []);
        return res;
    }

    public static async getAllToken() : Promise<any[]> {
        const sql = `
            SELECT * FROM ${Token.table_name};
        `;
        const res = await executeSQL(sql, []);
        return res;
    }


}