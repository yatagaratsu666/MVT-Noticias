import { Request, Response } from "express";
import NewsModel from "../model/NewsModel";

export default class NewsView {
  constructor(private readonly newsModel: NewsModel) {}

  readonly getNewsList = (req: Request, res: Response) => {
    const page = parseInt(req.query["page"] as string) || 1;
    const searchQuery = (req.query["search"] as string) || "";

    const { news, totalPages, paginationPages } = this.newsModel.getNews({
      searchQuery,
      page,
      pageSize: 4,
    });

    const renderData = {
      news,
      currentPage: page,
      totalPages,
      paginationPages,
      searchQuery,
      currentPath: req.originalUrl,
    };

    res.render("news", renderData);
  };
}
