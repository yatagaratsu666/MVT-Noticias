import NewsModel from "../../src/news/model/NewsModel";
import News, { Commentary } from "../../src/news/types/News";

jest.mock("../../database/news.json", () => {
  const mockCommentaries1: Commentary[] = [
    {
      author: "Ana",
      description: "Excelente noticia",
      publishedAt: new Date("2025-01-02T00:00:00.000Z"),
    },
    {
      author: "Luis",
      description: "Muy interesante",
      publishedAt: new Date("2025-01-03T00:00:00.000Z"),
    },
  ];

  const mockNews: News[] = [
    {
      id: 1,
      title: "Exploración espacial avanza",
      description: "Nuevos descubrimientos en Marte",
      content: "Contenido sobre los avances de la NASA",
      image: "https://img.com/marte.png",
      publishedAt: new Date("2025-01-01T00:00:00.000Z"),
      commentaries: mockCommentaries1,
    },
    {
      id: 2,
      title: "Tecnología cuántica en alza",
      description: "Nuevos procesadores cuánticos",
      content: "Contenido sobre avances en IBM y Google",
      image: "https://img.com/cuantic.png",
      publishedAt: new Date("2025-02-10T00:00:00.000Z"),
      commentaries: [],
    },
    {
      id: 3,
      title: "Astronomía moderna",
      description: "Nuevos telescopios en desarrollo",
      content: "Avances en óptica espacial",
      image: "https://img.com/telescope.png",
      publishedAt: new Date("2025-03-15T00:00:00.000Z"),
      commentaries: [],
    },
        {
      id: 4,
      title: "Astronomía moderna",
      description: "Nuevos telescopios en desarrollo",
      content: "Avances en óptica espacial",
      image: "https://img.com/telescope.png",
      publishedAt: new Date("2025-03-15T00:00:00.000Z"),
      commentaries: [],
    }
  ];

  return mockNews;
});

describe("NewsModel", () => {
  let newsModel: NewsModel;

  beforeEach(() => {
    newsModel = new NewsModel();
    jest.clearAllMocks();
  });

  test("debe obtener todas las noticias con fechas convertidas a Date", () => {
    const result: News[] = newsModel.getAllNews();

    expect(result.length).toBeGreaterThan(0);
    result.forEach((news: News) => {
      expect(news.publishedAt).toBeInstanceOf(Date);
      news.commentaries.forEach((c: Commentary) => {
        expect(c.publishedAt).toBeInstanceOf(Date);
      });
    });
  });

  test("debe filtrar noticias por título correctamente", () => {
    const result = newsModel.getNews({ searchQuery: "cuántica" });
    expect(result.news.length).toBe(1);
    expect(result.news[0]?.title).toContain("cuántica");
  });

  test("debe devolver todas las noticias si no se especifica búsqueda", () => {
    const result = newsModel.getNews({});
    expect(result.news.length).toBeGreaterThan(0);
  });

  test("debe realizar la paginación correctamente", () => {
    const result = newsModel.getNews({ page: 1, pageSize: 2 });
    expect(result.news.length).toBeLessThanOrEqual(2);
    expect(result.totalPages).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(result.paginationPages)).toBe(true);
  });

  test("debe generar las páginas de paginación correctamente (inicio)", () => {
    const pages = newsModel.getPaginationPages(1, 10);
    expect(pages).toContain(1);
    expect(pages).toContain("…");
    expect(pages).toContain(5);
  });

  test("debe generar las páginas de paginación correctamente (final)", () => {
    const pages = newsModel.getPaginationPages(9, 10);
    expect(pages).toContain(10);
    expect(pages[0]).toBe(1);
  });

  test("debe mostrar las páginas finales completas si currentPage está cerca del final", () => {
    const pages = newsModel.getPaginationPages(9, 10);
    expect(pages.some((p) => typeof p === "number" && p > 5)).toBe(true);
  });

  test("debe comportarse como Mockito (espías) sin alterar datos originales", () => {
    const spyGetAll = jest.spyOn(newsModel, "getAllNews");
    const spyFilter = jest.spyOn<any, any>(newsModel, "filterNewsByTitle");

    const result = newsModel.getNews({ searchQuery: "Exploración" });

    expect(spyGetAll).toHaveBeenCalledTimes(1);
    expect(spyFilter).toHaveBeenCalledTimes(1);
    expect(result.news[0]?.title).toContain("Exploración espacial");

    const original: News[] = newsModel.getAllNews();
    expect(original.length).toBeGreaterThan(0);
  });
});
