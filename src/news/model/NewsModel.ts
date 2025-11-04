import News from "../types/News";
import news_json from "../../../database/news.json";

export default class NewsModel {
  readonly getAllNews = (): News[] => {
    return news_json.map((n) => ({
      ...n,
      publishedAt: new Date(n.publishedAt),
      commentaries: n.commentaries.map((c) => ({
        ...c,
        publishedAt: new Date(c.publishedAt),
      })),
    }));
  };

  private filterNewsByTitle = (query: string, news: News[]): News[] => {
    if (!query) return news;
    return news.filter((n) =>
      n.title.toLowerCase().includes(query.toLowerCase())
    );
  };

  readonly getNews = (options: {
    searchQuery?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const { searchQuery = "", page = 1, pageSize = 4 } = options;

    let allNews = this.getAllNews();
    allNews = this.filterNewsByTitle(searchQuery, allNews);

    const totalNews = allNews.length;
    const totalPages = Math.ceil(totalNews / pageSize);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const newsPage = allNews.slice(start, end);

    return {
      news: newsPage,
      totalPages,
      totalNews,
      paginationPages: this.getPaginationPages(page, totalPages),
    };
  };

  readonly getPaginationPages = (currentPage: number, totalPages: number, maxVisible = 5): (number | string)[] => {
    const pages: (number | string)[] = [];

    if (currentPage > Math.ceil(maxVisible / 2) + 1) {
      pages.push(1);
      pages.push("…");
    }

    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = Math.min(currentPage + Math.floor(maxVisible / 2), totalPages);

    if (currentPage <= Math.ceil(maxVisible / 2)) {
      end = Math.min(maxVisible, totalPages);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      pages.push("…");
      pages.push(totalPages);
    }

    return pages;
  };
}
