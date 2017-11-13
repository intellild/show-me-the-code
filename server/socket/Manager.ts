/// <reference types="socket.io" />

import * as models from '../models';
import Room from './Room';

export default class SocketManager {
  io: SocketIO.Server
  rooms: Map<string, Room> = new Map()

  constructor(io: SocketIO.Server) {
    this.io = io;
    this.initSocket();
  }

  initSocket() {
    this.io.on('connection', socket => {
      socket.on('room.join', async (data: ISocketRoomJoin) => {
        const userName = data.userName;
        try {
          const room = await models.Room.findOne({
            where: {
              id: data.id
            }
          });
          if (!room) {
            socket.emit('room.fail', 'room not exist');
            return;
          } else if (room.dataValues.key.trim() === data.key) {
            if (!this.rooms.has(data.id)) {
              this.rooms.set(data.id, new Room(this.io, data.id, this, room.dataValues.content, room.dataValues.language, room.dataValues.creatorKey));
            }
            console.log(data.creatorKey)
            console.log(room.dataValues.creatorKey)
            this.rooms.get(data.id).join(userName, socket, data.creatorKey === room.dataValues.creatorKey);
          } else {
            socket.emit('room.fail', 'wrong key');
          }
        } catch (error) {
          socket.emit('room.fail', error.toString());
        }
      });
    });
  }
}
