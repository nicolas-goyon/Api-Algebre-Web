import express from 'express';
import { db } from '../rooter/database';
export const router = express.Router();




/* -------------------------------------------------------------------------- */
/*                                    CLASS                                   */
/* -------------------------------------------------------------------------- */

export interface utilisateur {
    id: number;
    pseudo: string;
    password: string;
    email: string;
    create_date: string;
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

    public static async getUtilisateurById(id:number): Promise<Utilisateur|null>{
        const data = await Utilisateur.getDataUtilisateurById(id);
        if (data !== undefined)
            return new Utilisateur(id, data.pseudo, data.password, data.email, data.create_date);
        return null;
    }

    public static async getDataUtilisateurById(id:number): Promise<utilisateur | undefined>{
        const data = await db.selectFrom('utilisateur').where('id', '=', id).selectAll().executeTakeFirst();
        return data;
    }

}
export default router;
