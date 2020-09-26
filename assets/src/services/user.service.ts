import { Injectable } from '@angular/core';
import { Octokit } from '@octokit/rest';
import * as Cookie from 'cookie';
import { IUser } from "../models";

@Injectable()
export class UserService {
  private readonly client: Octokit;
  private user: IUser | null = null;

  constructor() {
    const token = this.getToken();
    console.log(token)
    if (!token) {
      location.href = "/api/auth/github";
      return;
    }
    this.client = new Octokit({
      auth: token,
    });
  }

  async getUser(): Promise<IUser> {
    if (!this.user) {
      const { data } = await this.client.users.getAuthenticated();
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
}
