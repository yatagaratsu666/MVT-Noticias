import { Request, Response } from "express";
import NewsModel from "../../news/model/NewsModel";

export default class DetailView {
  constructor(private readonly newsModel: NewsModel) {}

  readonly getNewsDetail = (req: Request, res: Response) => {
    const idParam = req.params["id"];

    /* istanbul ignore next: No se puede asignar la ruta /news/v.10/details/ sin el id al final, xq tira directo un error 404 */
    const id = idParam ? parseInt(idParam) : NaN;
    if (!idParam || isNaN(id)) {
      return res.status(400).send("ID de noticia requerido");
    }

    const noticia = this.newsModel.getAllNews().find((n) => n.id === id);

    if (!noticia) {
      return res.status(404).send("Noticia no encontrada");
    }

    return res.status(200).render("detail", {
      currentPath: req.originalUrl,
      noticia,
    });
  };
}
