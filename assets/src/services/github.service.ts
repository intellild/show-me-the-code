import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';
import * as Cookie from 'cookie';
import { IGist, IGistFile, IUser } from '../models';

export const token = Cookie.parse(document.cookie).github_token;

function auth(): never {
  location.href = '/api/auth/github';
  throw new Error('auth');
}

if (!token) {
  auth();
}

@Injectable()
export class GithubService {
  private readonly client: Octokit;
  private user: IUser | null = null;
  public readonly token: string;

  constructor() {
    if (!token) {
      auth();
    }
    this.token = token;
    this.client = new Octokit({
      auth: token,
    });
  }

  async getUser(): Promise<IUser> {
    if (!this.user) {
      const { data, status } = await this.client.users.getAuthenticated();
      if (status !== 200) {
        auth();
      }
      this.user = {
        id: data.id,
        avatar: data.avatar_url,
        url: data.html_url,
        email: data.email,
        name: data.name,
      };
    }
    return this.user;
  }

  async getGists(page: number): Promise<IGist[]> {
    const { data, status } = await this.client.gists.list({
      per_page: 20,
      page,
    });
    if (status !== 200) {
      return [];
    }
    return data.map((gist) => {
      const { id, description, public: isPublic, created_at, updated_at } = gist;
      const files: IGistFile[] = Object.values(gist.files).map(({ filename, type, language }) => ({
        filename,
        type,
        language,
      }));
      const name = files.length ? files[0].filename : '';
      return {
        id,
        name,
        isPublic,
        createdAt: new Date(created_at),
        updatedAt: new Date(updated_at),
        description,
        files,
      };
    });
  }
}
