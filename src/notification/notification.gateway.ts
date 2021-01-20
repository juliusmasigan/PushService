import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Payload } from './dto/notification.dto';
import * as jwt from 'jsonwebtoken';
import { NotificationService } from "./notification.service";
import * as lodash from 'lodash';


@WebSocketGateway({
  namespace: 'notification',
  transports: ['websocket']
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private notificationService: NotificationService) { }

  // From this point forward the JWT token is already verified.
  async handleConnection(client: Socket) {
    const request: any = client.request;
    const token = request._query.token;
    const claims: any = jwt.decode(token);

    this.notificationService.clients.push({
      ...claims,
      wsId: client.id,
    });
    console.log(`Connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    lodash.remove(this.notificationService.clients, (c) => c.wsId === client.id);
    console.log(`Disconnected: ${client.id}`);
  }

  async send(recipient: string, sender: string, payload: Payload, id?: string | number) {
    const to = lodash.find(this.notificationService.clients, { email: recipient });
    if (to) {
      this.server.to(to.wsId).emit(payload.topic, {
        ...payload,
        content: { ...payload.content, '_persistId': id }
      });
    } else {
      // Broadcast to all connected users.
      // this.server.emit(payload.topic, { id, ...payload });
    }
  }
}
