import { Router } from "express";
import DetailView from "../view/DetailView";

export default class DetailRouter {
  router: Router;

  constructor(private readonly detailView: DetailView) {
    this.router = Router();
    this.routes();
  }

  readonly routes = () => {
    this.router.get("/v1.0/detail/:id", this.detailView.getNewsDetail);
  };
}
