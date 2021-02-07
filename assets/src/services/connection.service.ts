import { Injectable } from '@angular/core';
import * as EventEmitter from 'eventemitter3';
import { observable } from 'mobx-angular';
import { Channel } from 'phoenix';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models';
import { GithubService } from './github.service';
import { WebSocketConnection } from './WebSocketConnection';

export interface ISocketEvents {
  'sync.full': { content: string; language: string; expires: string | null };
  'sync.full.request': {};
  'sync.full.reply': { content: string; language: string; expires: Date | null };
  'user.edit': { from: string; event: string };
  'user.selection': { from: string; event: string };
  'user.cursor': { from: string; event: string };
  'user.leave': { userId: string };
}

const EVENTS = ['sync.full', 'sync.full.request', 'user.edit', 'user.selection', 'user.cursor'];

export enum ConnectState {
  Connecting = 'connecting',
  Connected = 'connected',
  LoginSuccess = 'login-success',
  JoinSuccess = 'join-success',
}

export enum JoinState {
  Connecting,
  WaitingForAccept,
  Accepted,
}

@Injectable()
export class ConnectionService extends EventEmitter<keyof ISocketEvents> {
  public readonly connectState$ = new BehaviorSubject(ConnectState.Connecting);

  private serverConnection: WebSocketConnection | null = null;

  // private userChannel: Channel | null = null;
  private roomChannel: Channel | null = null;
  private pendingJoin$: BehaviorSubject<JoinState> | null = null;

  @observable
  users: IUser[] = [];
  // readonly userList$ = new BehaviorSubject<IUser[]>([]);
  // readonly synchronized$ = new BehaviorSubject(false);
  // readonly autoSave$ = new BehaviorSubject(false);
  // readonly userMap = new Map<string, IUser>();

  declare on: <K extends keyof ISocketEvents>(
    this: this,
    event: K,
    cb: (message: ISocketEvents[K], context?: any) => void,
  ) => this;
  declare off: <K extends keyof ISocketEvents>(
    this: this,
    event: K,
    cb: (message: ISocketEvents[K], context?: any) => void,
  ) => this;

  constructor(private readonly githubService: GithubService) {
    super();
  }

  connect(user: IUser) {
    this.serverConnection = new WebSocketConnection(user);
    this.serverConnection
      .on('open', () => {
        this.connectState$.next(ConnectState.Connected);
      })
      .on('login:ok', () => {
        this.connectState$.next(ConnectState.LoginSuccess);
      });
  }

  push<K extends keyof ISocketEvents>(event: K, payload: ISocketEvents[K]) {
    // this.roomChannel?.push(event, payload);
  }

  async open(id: string): Promise<void> {
    if (!this.serverConnection) {
      throw new Error('not connected');
    }
    await this.create(id);
    this.roomChannel = await this.serverConnection.room(`room:${id}`);
    this.connectState$.next(ConnectState.JoinSuccess);
  }

  public requestJoin(id: string): BehaviorSubject<JoinState> {
    if (!this.serverConnection) {
      throw new Error('not connected');
    }
    const state$ = new BehaviorSubject(JoinState.Connecting);
    this.pendingJoin$ = state$;
    this.serverConnection.call('join:request', { id }).then(
      () => state$.next(JoinState.WaitingForAccept),
      (error) => {
        state$.error(error);
        this.pendingJoin$ = null;
      },
    );
    return state$;
  }

  async join(id: string): Promise<void> {
    await this.requestJoin(id);

    // const channel = this.socket.channel(`room:${id}`);
    // await this.joinChannel(channel);
    // const links = linkEvents(EVENTS, channel, this as EventEmitter<string>);
    // const presence = new Presence(channel);
    // presence.onSync(() => {
    //   const userList = presence.list<IUser>((_, { metas }) => metas[0]);
    // this.userList$.next(userList);
    // this.userMap.clear();
    // for (let i = 0; i < userList.length; i += 1) {
    //   const user = userList[i];
    //   this.userMap.set(user.id, user);
    // }
    // });
    // presence.onLeave((userId) => this.emit('user.leave', { userId }));
  }

  save(content: string, language: string): Promise<void> {
    // const channel = this.channel$.getValue();
    // if (!channel) {
    //   return Promise.reject();
    // }
    return new Promise<void>((resolve, reject) => {
      // channel
      //   .push('save', {
      //     content,
      //     language,
      //   })
      //   .receive('ok', resolve)
      //   .receive('error', reject);
    });
  }

  private async create(id: string): Promise<void> {
    return this.serverConnection?.call('open', { id });
  }

  private updateUrl() {
    const url = new URL(location.href);
    // url.searchParams.set('roomId', this.roomId);
    history.replaceState(history.state, document.title, url.href);
  }

  private handleJoinError(
    { reason }: { reason: string },
    links: Record<string, number>,
    channel: Channel,
    reject: (e: Error) => void,
  ) {
    let msg = 'Unknown error';
    let leave = false;
    switch (reason) {
      case 'join crashed':
        leave = true;
        break;
      case 'invalid room id':
      case 'room not exist':
      case 'room is full':
        msg = `Join room fail, ${reason}`;
        leave = true;
        break;
      default:
        break;
    }

    // this.messageService.add({
    //   severity: 'error',
    //   summary: 'Join fail',
    //   detail: msg,
    // });
    if (leave) {
      channel.leave();
      // this.channel$.next(null);
      // unlinkEvents(links, channel);
    }
    reject(new Error(msg));
  }
}
