import { Room, Client } from "@colyseus/core";
//import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"
import { randomBytes } from "crypto"
import { State, Bullet, Player } from "../State"


export class GameRoom extends Room<State> {
    maxClients = 8;


    onCreate(options: any) {
        this.setState(new State());
        this.setPatchRate(15.625)



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
            this.state.bullets.set(randomBytes(16).toString('hex'), new Bullet(player.position.x, player.position.y, message.angle, client.id))
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


    }

    onBeforePatch() {
        this.state.bullets.forEach((bullet) => {
            bullet.position.x += Math.cos(bullet.angle)
            bullet.position.y += Math.sin(bullet.angle)
        })

        this.state.players.forEach((player) => {
            this.state.bullets.forEach((bullet, key) => {
                if(bullet.shotById != player.id){
                    if (Math.hypot(player.position.x - bullet.position.x, player.position.y - bullet.position.y) <= (bullet.radius + player.radius)) {
                        player.health -= 10;
                        this.state.bullets.delete(key);
                    }
                }
            })
        })
    }


    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!", options);
        if (options && options.name) {
            this.state.players.set(client.sessionId, new Player(options.name,client.id));
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
