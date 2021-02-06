import { Injectable } from '@angular/core';
import { ApolloClient, gql, InMemoryCache } from '@apollo/client/core';
import * as Cookie from 'cookie';
import { IGist, IUser } from '../models';
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
  private readonly client: ApolloClient<unknown>;
  private user: IUser | null = null;
  public readonly token: string;

  constructor() {
    this.token = token;
    this.client = new ApolloClient({
      uri: 'https://api.github.com/graphql',
      cache: new InMemoryCache(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getUser(): Promise<IUser> {
    if (!this.user) {
      const query = await this.client.query<User>({
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
    const query = await this.client.query<ListGists, ListGistsVariables>({
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
}
