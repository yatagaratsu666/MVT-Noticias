import { Request, Response } from "express";
import PostModel from "../model/PostModel";

export default class PostView {
  constructor(private readonly createModel: PostModel) {}

  readonly showForm = (req: Request, res: Response) => {
    res.render("post", { createdNews: null, error: null, currentPath: req.originalUrl });
  };

  readonly postNews = (req: Request, res: Response) => {
    const { title, description, content, image, commentAuthor, commentDescription } = req.body;

    if (!title || !description || !content || !image) {
      return res.render("post", {
        error: "Todos los campos de la noticia son obligatorios.",
        createdNews: null,
        currentPath: "/post",
      });
    }

    // Procesar comentarios (pueden venir como string o array)
    const comments: { author: string; description: string }[] = [];
    if (commentAuthor && commentDescription) {
      const authors = Array.isArray(commentAuthor) ? commentAuthor : [commentAuthor];
      const descriptions = Array.isArray(commentDescription) ? commentDescription : [commentDescription];

      for (let i = 0; i < authors.length; i++) {
        if (authors[i] && descriptions[i]) {
          comments.push({ author: authors[i], description: descriptions[i] });
        }
      }
    }

    const createdNews = this.createModel.createNews({
      title,
      description,
      content,
      image,
      commentaries: comments,
    });

    console.log("📰 Noticia creada (simulada):", createdNews);

    res.render("post", { createdNews, error: null, currentPath: "/post" });
  };
}

