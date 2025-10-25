import { Request, Response } from "express"

export default class HomeView{

    constructor(){}

    readonly getProductList = (req: Request, res: Response) => {
        res.status(200).render('home', { currentPath: req.path })
    }
}