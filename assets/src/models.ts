export interface IUser {
  id: number;
  avatar: string;
  url: string;
  email: string;
  name: string;
}

export interface IGist {
  id: string;
  name: string;
  description: string;
  files: IGistFile[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGistFile {
  filename: string;
  type: string;
  language: string;
}
