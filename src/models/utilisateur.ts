import { Generated } from "kysely";
import { db, executeSQL } from "../rooter/database";
/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */


export interface utilisateur {
    id: Generated<number>;
    pseudo: string;
    password: string;
    email: string;
    create_date: Generated<string>;
}

export class Utilisateur {
    public static readonly table_name = "utilisateur";

    private id : number | null;
    private pseudo: string;
    private password: string;
    private email: string;
    private create_date: string | null;
    
    constructor(id:number | null, pseudo: string, password: string, email: string, create_date: string | null){
        this.id = id
        this.pseudo = pseudo
        this.password = password
        this.email = email
        this.create_date = create_date
    }

    public setPseudo(pseudo: string){
        this.pseudo = pseudo;
    }

    public setPassword(password: string){
        this.password = password;
    }

    public setEmail(email: string){
        this.email = email;
    }

    public getId(): number | null{
        return this.id;
    }

    public getPseudo(): string{
        return this.pseudo;
    }

    public getPassword(): string{
        return this.password;
    }

    public getEmail(): string{
        return this.email;
    }

    public getCreateDate(): string | null{
        return this.create_date;
    }


    public async save() {
        if (this.id === null) {
            const result = await db
                .insertInto(Utilisateur.table_name)
                .values({ pseudo: this.pseudo, password: this.password, email: this.email })
                .returning(['id', 'create_date'])
                .executeTakeFirst()
            
            if(result !== undefined){
                this.id = result.id
                this.create_date = result.create_date
            }
        } else {
            await db
                .updateTable(Utilisateur.table_name)
                .set({ pseudo: this.pseudo, password: this.password, email: this.email })
                .where('id', '=', this.id)
                .execute()
        }
    }

    public async delete() {
        if (this.id !== null) {
            await db
                .deleteFrom(Utilisateur.table_name)
                .where('id', '=', this.id)
                .execute()
        }
    }

    public static async getAllUtilisateurs(): Promise<Utilisateur[]>{
        const data = await Utilisateur.getDataAllUtilisateurs();
        let utilisateurs: Utilisateur[] = [];
        for (let i = 0; i < data.length; i++) {
            utilisateurs.push(new Utilisateur(data[i].id, data[i].pseudo, data[i].password, data[i].email, data[i].create_date));
        }
        return utilisateurs;
    }

    public static async getDataAllUtilisateurs(): Promise<{ password: string; id: number; pseudo: string; email: string; create_date: string; }[]>{
        const data = await db.selectFrom(Utilisateur.table_name).selectAll().execute();
        return data;
    }

    public static async getUtilisateurById(id:number): Promise<Utilisateur|null>{
        const data = await Utilisateur.getDataUtilisateurById(id);
        if (data !== undefined)
            return new Utilisateur(id, data.pseudo, data.password, data.email, data.create_date);
        return null;
    }

    public static async getDataUtilisateurById(id:number): Promise<{ password: string; id: number; pseudo: string; email: string; create_date: string; } | undefined>{
        const data = await db.selectFrom(Utilisateur.table_name).where('id', '=', id).selectAll().executeTakeFirst();
        return data;
    }

    public static async getUtilisateurByPseudo(pseudo:string): Promise<Utilisateur|null>{
        const data = await Utilisateur.getDataUtilisateurByPseudo(pseudo);
        if (data !== undefined)
            return new Utilisateur(data.id, pseudo, data.password, data.email, data.create_date);
        return null;
    }

    public static async getDataUtilisateurByPseudo(pseudo:string): Promise<{ password: string; id: number; pseudo: string; email: string; create_date: string; } | undefined>{
        const data = await db.selectFrom(Utilisateur.table_name).where('pseudo', '=', pseudo).selectAll().executeTakeFirst();
        return data;
    }

    public static async getUtilisateurByEmail(email:string): Promise<Utilisateur|null>{
        const data = await Utilisateur.getDataUtilisateurByEmail(email);
        if (data !== undefined)
            return new Utilisateur(data.id, data.pseudo, data.password, email, data.create_date);
        return null;
    }

    public static async getDataUtilisateurByEmail(email:string): Promise<{ password: string; id: number; pseudo: string; email: string; create_date: string; } | undefined>{
        const data = await db.selectFrom(Utilisateur.table_name).where('email', '=', email).selectAll().executeTakeFirst();
        return data;
    }

    public static async createTableUtilisateur(){
        let query = "CREATE TABLE IF NOT EXISTS utilisateur (" +
            "id SERIAL PRIMARY KEY," +
            "pseudo VARCHAR(255) NOT NULL," +
            "password VARCHAR(255) NOT NULL," +
            "email VARCHAR(255) NOT NULL," +
            "create_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP" +
            ");";
        let result = await executeSQL(query, []);
        return result;
    }

}
