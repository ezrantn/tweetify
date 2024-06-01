export class Tweet {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  image: string | null;
  impression: number;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    content: string,
    image: string | null,
    impression: number,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.content = content;
    this.image = image;
    this.impression = impression;
  }
}
