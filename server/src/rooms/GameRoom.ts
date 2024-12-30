import { Room, Client } from "@colyseus/core";
import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"
import { randomBytes } from "crypto"

export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class Player extends Schema {
    @type("string") name: string;

    @type(Position) position: Position;

    @type("boolean") grappling: boolean;
    @type("number") grappleX: number;
    @type("number") grappleY: number;

    constructor(name: string) {
        super();
        this.name = name
        this.position = new Position(0, 0)
    }
}

export class Bullet extends Schema {
    @type(Position) position: Position;
    @type("number") angle: number;

    constructor(x: number, y: number, angle: number) {
        super()
        this.position = new Position(x, y)
        this.angle = angle;

    }
}

export class State extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
}




export class GameRoom extends Room<State> {
    maxClients = 8;


    onCreate(options: any) {
        this.setState(new State());



        this.onMessage(C2SPacket.Ping, (client, message) => {
            client.send(S2CPackets.Pong, {})
        })

        this.onMessage(C2SPacket.Move, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            player.position.x = message.x
            player.position.y = message.y
        })

        this.onMessage(C2SPacket.Shoot, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            this.state.bullets.set(randomBytes(16).toString('hex'), new Bullet(player.position.x, player.position.y,message.angle))
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
            if (player.grappling) {
                player.grappling = false
            }
        })

        this.clock.setInterval(() => {
            this.state.bullets.forEach((bullet) => {
                bullet.position.x += Math.cos(bullet.angle)
                bullet.position.y += Math.sin(bullet.angle)
            })
        }, 1000 / 60)



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
