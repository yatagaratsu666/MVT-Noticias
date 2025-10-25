import { Request, Response } from "express";
import NewsModel from "../../news/model/NewsModel";

export default class DetailView {

  constructor(private readonly newsModel: NewsModel) {}

readonly getNewsDetail = (req: Request, res: Response) => {
  const idParam = req.params["id"];
  if (!idParam) return res.status(400).send('ID de noticia requerido');

  const id = parseInt(idParam);
  const noticia = this.newsModel.getAllNews().find(n => n.id === id);

  if (!noticia) {
    return res.status(404).send('Noticia no encontrada');
  }

  return res.status(200).render('detail', { 
    currentPath: req.originalUrl,
    noticia
  });
}

}
