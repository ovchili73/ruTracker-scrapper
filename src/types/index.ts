export interface ICategory {
  id: string;
  name: string;
  url: string;
  subcategories: string[]; // ID подразделов
}

export interface ISubcategory {
  id: string;
  categoryId: string;
  name: string;
  url: string;
}

export interface IUser {
  username: string;
  profileUrl?: string;
}

export interface IThank {
  user: IUser;
  date: Date;
}

export interface ITorrent {
  topicId: string;
  title: string;
  description: string;
  author: IUser;
  releaseDate: Date;
  magnetLink?: string;
  torrentFileUrl?: string;
  thanks: IThank[];
  subcategoryId: string;
}
