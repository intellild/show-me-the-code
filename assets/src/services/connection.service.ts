import { observable } from 'mobx-angular';
import { Socket, Channel, Presence } from 'phoenix';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as EventEmitter from 'eventemitter3';
import { token } from '../auth';
import { environment } from '../environments/environment';
import { IUser } from '../models';
import { linkEvents, unlinkEvents } from '../utils';

const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

const url = environment.production
  ? `${protocol}://socket.icode.live/socket`
  : `${protocol}://${location.hostname}:4000/socket`;

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

@Injectable()
export class ConnectionService extends EventEmitter<keyof ISocketEvents> {
  @observable
  connected = false;

  private socket = new Socket(url, {
    heartbeatIntervalMs: 30000,
    params: {
      token,
    },
  });

  @observable
  users = [];

  // readonly userList$ = new BehaviorSubject<IUser[]>([]);
  // readonly synchronized$ = new BehaviorSubject(false);
  readonly autoSave$ = new BehaviorSubject(false);
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

  constructor() {
    super();
    // this.on('sync.full', () => this.synchronized$.next(true));
  }

  push<K extends keyof ISocketEvents>(event: K, payload: ISocketEvents[K]) {
    // const channel = this.channel$.getValue();
    // if (channel) {
    //   channel.push(event, payload);
    // }
  }

  getSocket(username: string): Socket {
    if (this.socket === null) {
      this.socket = new Socket(url, {
        heartbeatIntervalMs: 30000,
        params: {
          username,
        },
      });
      this.socket.onOpen(() => (this.connected = true));
      this.socket.onClose(() => {
        this.connected = false;
        // this.synchronized$.next(false);
      });
      this.socket.connect();
    }
    return this.socket;
  }

  join(roomId: string, username: string): Promise<void> {
    const socket = this.getSocket(username);
    const channel = socket.channel(`room:${roomId}`);
    const links = linkEvents(EVENTS, channel, this as EventEmitter<string>);
    const presence = new Presence(channel);
    presence.onSync(() => {
      const userList = presence.list<IUser>((_, { metas }) => metas[0]);
      // this.userList$.next(userList);
      // this.userMap.clear();
      // for (let i = 0; i < userList.length; i += 1) {
      //   const user = userList[i];
      //   this.userMap.set(user.id, user);
      // }
    });
    presence.onLeave((userId) => this.emit('user.leave', { userId }));
    return new Promise<void>((resolve, reject) => {
      channel
        .join()
        .receive('ok', ({ userId }: { userId: string }) => {
          this.updateUrl();
          resolve();
        })
        .receive('error', (msg) => this.handleJoinError(msg, links, channel, reject));
    });
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

  private updateUrl() {
    const url = new URL(location.href);
    // url.searchParams.set('roomId', this.roomId);
    history.replaceState(history.state, '', url.href);
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
      unlinkEvents(links, channel);
    }
    reject(new Error(msg));
  }
}
