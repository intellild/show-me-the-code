import { Injectable } from '@angular/core';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core';
import { Octokit } from '@octokit/rest';
import * as Cookie from 'cookie';
import { IGistFile, IUser } from '../models';
import { ListGists, ListGists_viewer_gists, ListGistsVariables } from './__generated__/ListGists';
import { User } from './__generated__/User';

export const token = Cookie.parse(document.cookie).github_token;

function auth() {
  location.href = '/api/auth/github';
}

if (!token) {
  auth();
}

@Injectable()
export class GithubService {
  private readonly graphql: ApolloClient<unknown>;
  private readonly rest: Octokit;
  private user: IUser | null = null;
  public readonly token: string;

  constructor() {
    this.token = token;
    this.graphql = new ApolloClient({
      uri: 'https://api.github.com/graphql',
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.rest = new Octokit({
      auth: token,
    });
  }

  async getUser(): Promise<IUser> {
    if (!this.user) {
      const query = await this.graphql.query<User>({
        query: gql`
          query User {
            viewer {
              id
              databaseId
              name
              avatarUrl
              url
              email
            }
          }
        `,
      });
      if (!query.error && !query.errors?.length) {
        this.user = query.data.viewer;
      } else {
        throw new Error('error getting user info');
      }
    }
    return this.user;
  }

  async getGists(count: number, from: string | null = null): Promise<ListGists_viewer_gists> {
    const query = await this.graphql.query<ListGists, ListGistsVariables>({
      query: gql`
        query ListGists($count: Int!, $from: String) {
          viewer {
            gists(first: $count, after: $from) {
              totalCount
              nodes {
                id
                name
                description
                files {
                  name
                  text
                }
              }
            }
          }
        }
      `,
      variables: {
        count,
        from,
      },
    });
    if (!query.error && !query.errors?.length) {
      return query.data.viewer.gists;
    } else {
      throw new Error('error getting lists');
    }
  }

  async saveFile(id: string, file: IGistFile) {
    if (!file.name || !file.text) {
      throw new Error();
    }
    const request = await this.rest.gists.get({
      gist_id: id,
    });
    if (request.status !== 200) {
      throw new Error();
    }
    const gist = request.data;
    const save = await this.rest.gists.update({
      gist_id: id,
      files: {
        ...gist.files,
        [file.name]: {
          ...gist.files?.[file.name],
          filename: file.name,
          content: file.text,
        },
      },
    });
    if (save.status !== 200) {
      throw new Error();
    }
  }
}
