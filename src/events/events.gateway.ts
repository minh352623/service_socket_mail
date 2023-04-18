import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { map, Observable, from, of } from "rxjs";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("events")
  findAll(@MessageBody() data: any): Observable<WsResponse<any>> {
    console.log(data);
    // return from({ data: "hello" }).pipe(
    //   map((item) => ({ event: "events", data: item }))
    // );
    return of({ name: "congminh", age: 18 }).pipe(
      map((dataNew) => {
        console.log(dataNew);
        return { event: "events", data: dataNew };
      })
    );
  }

  @SubscribeMessage("identity")
  identity(@MessageBody() data: number): Observable<WsResponse<string>> {
    console.log(data);
    return from(["hello", "hi"]).pipe(
      map((item) => ({ event: "identity", data: item }))
    );
    // return data;
  }
}
