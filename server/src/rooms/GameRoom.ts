import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";

export class Player extends Schema {
  x: number = 0.0;
  y: number = 0.0;
}

// Our custom game state, an ArraySchema of type Player only at the moment
export class State extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new State());

    this.onMessage("message", (client, message) => {
      console.log("message",client, message);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!",options);
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
