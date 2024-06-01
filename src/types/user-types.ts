export class User {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  image: string | null;
  isVerified: boolean;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    name: string | null,
    username: string | null,
    bio: string | null,
    image: string | null,
    isVerified: boolean,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.email = email;
    this.name = name;
    this.username = username;
    this.bio = bio;
    this.image = image;
    this.isVerified = isVerified;
  }
}
