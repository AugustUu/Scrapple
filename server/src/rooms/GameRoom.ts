import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"


export class Player extends Schema {
    name: String;
    postion: { x: number, y: number };
    constructor(name: string) {
        super();
        this.name = name
    }
}

export class State extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
}

export class GameRoom extends Room<State> {
    maxClients = 4;

    onCreate(options: any) {
        this.setState(new State());

        this.onMessage("message", (client, message) => {
            console.log("message", client, message);
        });

        this.onMessage(C2SPacket.Ping, (client, message) => {
            client.send(S2CPackets.Pong, {})
        })

        this.onMessage(C2SPacket.Connect, (client, message) => {
            if (!this.state.players.get(client.sessionId)) {
                this.state.players.set(client.sessionId, new Player(message.name));
                client.send(S2CPackets.InitClient, client.sessionId)
            }
        })

    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!", options);
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
