import { EventEmitter } from 'eventemitter3';
import { Channel, Socket } from 'phoenix';
import { token } from './github.service';
import { environment } from '../environments/environment';
import { IUser } from '../models';
import { linkEvents } from "../utils";

export interface IServerError {
  reason: string;
}

export interface IServerEvents {
  open: {};
  'login:ok': {};
  'login:error': IServerError;
  'join:request': { id: string };
}

export interface IServerCall {
  create: { id: string };
  'join:request': { id: string };
}

function getUrl() {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return environment.production
    ? `${protocol}://socket.icode.live/socket`
    : `${protocol}://${location.hostname}:4000/socket`;
}

export class WebSocketConnection extends EventEmitter<keyof IServerEvents> {
  private readonly socket = new Socket(getUrl(), {
    heartbeatIntervalMs: 30000,
    params: {
      token,
    },
  });
  private readonly userChannel: Channel;

  constructor(user: IUser) {
    super();
    this.socket.onOpen(() => {
      this.emit('open');
    });
    this.userChannel = this.socket.channel(`user:${user.id}`);
    this.userChannel
      .join()
      .receive('ok', () => {
        this.emit('login:ok');
      })
      .receive('error', (error) => {
        this.emit('login:error', error);
      });
    linkEvents<keyof IServerEvents>([], this.userChannel, this);
    this.socket.connect();
  }

  public call<T extends keyof IServerCall>(type: T, payload: IServerCall[T]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.userChannel
        .push(type, payload)
        .receive('ok', resolve)
        .receive('error', ({ reason }) => {
          reject(new Error(reason));
        });
    });
  }

  public room(id: string): Promise<Channel> {
    return new Promise<Channel>((resolve, reject) => {
      const channel = this.socket.channel(id);
      channel
        .join()
        .receive('ok', () => resolve(channel))
        .receive('error', ({ reason }) => {
          channel.leave();
          reject(new Error(reason));
        });
    });
  }
}
