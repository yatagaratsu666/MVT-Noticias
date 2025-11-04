import PostModel from "../../src/post/model/PostModel";
import News, { Commentary } from "../../src/news/types/News";

describe("PostModel", () => {
  let postModel: PostModel;

  beforeEach(() => {
    postModel = new PostModel();
    jest.clearAllMocks();
  });

  test("debe crear una noticia correctamente con todos los campos", () => {
    const mockData = {
      title: "Título de prueba",
      description: "Descripción breve",
      content: "Contenido de la noticia",
      image: "https://fakeimg.com/img.png",
      commentaries: [
        { author: "Ana", description: "Excelente noticia" },
        { author: "Juan", description: "Muy interesante" },
      ],
    };

    const result: News = postModel.createNews(mockData);

    expect(result).toHaveProperty("id");
    expect(result.title).toBe(mockData.title);
    expect(result.description).toBe(mockData.description);
    expect(result.image).toBe(mockData.image);

    expect(result.commentaries.length).toBe(2);
    result.commentaries.forEach((c: Commentary) => {
      expect(c).toHaveProperty("publishedAt");
      expect(c.publishedAt).toBeInstanceOf(Date);
    });
  });

  test("debe crear una noticia sin comentarios si no se envían", () => {
    const mockData = {
      title: "Sin comentarios",
      description: "Noticia sin comentarios",
      content: "Contenido básico",
      image: "https://img.com/1.png",
    };

    const result: News = postModel.createNews(mockData);
    expect(result.commentaries).toEqual([]);
  });

  test("debe usar un mock de comentario (simulación tipo Mockito)", () => {
    const mockCommentary = jest.fn<Commentary, []>(() => ({
      author: "Mocked Author",
      description: "Mocked Description",
      publishedAt: new Date("2025-01-01T00:00:00.000Z"),
    }));

    const fakeComment: Commentary = mockCommentary();

    const mockData = {
      title: "Con comentario mockeado",
      description: "Noticia con mocks",
      content: "Texto cualquiera",
      image: "img.jpg",
      commentaries: [
        { author: fakeComment.author, description: fakeComment.description },
      ],
    };

    const result: News = postModel.createNews(mockData);

    expect(result.commentaries[0]?.author).toBe("Mocked Author");
    expect(result.commentaries[0]?.description).toBe("Mocked Description");
    expect(result.commentaries[0]?.publishedAt).toBeInstanceOf(Date);
  });
});
