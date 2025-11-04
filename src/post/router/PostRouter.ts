import { Router } from "express";
import PostView from "../view/PostView";

export default class PostRouter {
  router: Router;

  constructor(private readonly createView: PostView) {
    this.router = Router();
    this.routes();
  }

  readonly routes = () => {
    this.router.get("/v1.0/post", this.createView.showForm);
    this.router.post("/v1.0/post", this.createView.postNews);
  };
}
