import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"


export class Player extends Schema {
    @type("string") name: string;

    @type("number") x: number;
    @type("number") y: number;
    constructor(name: string) {
        super();
        this.name = name
        this.x = 0
        this.y = 0
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

        this.onMessage(C2SPacket.Move, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            player.x = message.x
            player.y = message.y
        })


    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!", options);
        if (options && options.name) {
            this.state.players.set(client.sessionId, new Player(options.name));
        }
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
