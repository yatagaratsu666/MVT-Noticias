import News from "../../news/types/News";
import { Commentary } from "../../news/types/News";

export default class PostModel {
  readonly createNews = (data: {
    title: string;
    description: string;
    content: string;
    image: string;
    commentaries?: { author: string; description: string }[];
  }): News => {
    const today = new Date();
    const publishedAt = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");

    const commentaries: Commentary[] = (data.commentaries || []).map((c) => ({
      author: c.author,
      description: c.description,
      publishedAt,
    }));

    const newNews: News = {
      id: Math.floor(Math.random() * 10000),
      title: data.title,
      description: data.description,
      content: data.content,
      image: data.image,
      publishedAt,
      commentaries,
    };

    return newNews;
  };
}
