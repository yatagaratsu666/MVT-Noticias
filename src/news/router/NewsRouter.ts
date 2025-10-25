import { Router } from "express";
import NewsView from "../view/NewsView";

export default class NewsRouter{
    router: Router

    constructor(
        private readonly homeView: NewsView,
    ){
        this.router = Router()
        this.routes()
    }

    readonly routes = () => {
        this.router.get('/v1.0/list', this.homeView.getNewsList)
    }

}