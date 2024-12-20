import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"


export class Player extends Schema {
    @type("string") name: string;

    @type("number") x: number;
    @type("number") y: number;

    @type("boolean") grappling: boolean;
    @type("number") grappleX: number;
    @type("number") grappleY: number;

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
    maxClients = 8;

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

        this.onMessage(C2SPacket.Shoot, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            this.broadcast(S2CPackets.BulletSpawn, { angle: message.angle, position: { x: player.x, y: player.y } })
        })

        this.onMessage(C2SPacket.Grapple, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            player.grappling = true;
            player.grappleX = message.x
            player.grappleY = message.y
            //this.broadcast(S2CPackets.BulletSpawn, { angle: message.angle, position: { x: player.x, y: player.y } })
        })

        this.onMessage(C2SPacket.EndGrapple, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            if(player.grappling){
                player.grappling = false
            }
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
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
