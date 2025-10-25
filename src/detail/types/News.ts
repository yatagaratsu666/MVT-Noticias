export interface Commentary {
  description: string;
  author: string;
  publishedAt: Date;
}

export default interface News {
  id: number;
  image: string;
  title: string;
  description: string;
  content: string;
  publishedAt: Date;
  commentaries: Commentary[];
}
