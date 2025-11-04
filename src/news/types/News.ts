export interface Commentary {
  description: string;
  author: string;
  publishedAt: string | Date;
}

export default interface News {
  id: number;
  image: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string | Date;
  commentaries: Commentary[];
}
