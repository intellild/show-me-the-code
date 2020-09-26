import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';
import * as Cookie from 'cookie';
import { IUser } from "../models";

@Injectable()
export class UserService {
  private readonly client: Octokit;
  private user: IUser | null = null;
  public readonly token: string;

  constructor() {
    const token = this.getToken();
    if (!token) {
      this.auth();
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
        this.auth();
      }
      this.user = {
        id: data.id,
        avatar: data.avatar_url,
        url: data.html_url,
        email: data.email,
        name: data.name
      };
    }
    return this.user;
  }

  private getToken(): string | undefined {
    return Cookie.parse(document.cookie).github_token;
  }

  private auth(): never {
    location.href = "/api/auth/github";
    throw new Error("auth");
  }
}
