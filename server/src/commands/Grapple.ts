import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { PlayerClient } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";



export class EndGrappleCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            if (player.grappling) {
                player.grappling = false
            }
        }

    }
}



export class StartGrappleCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            
            let player = this.state.players.get(client.sessionId)
            player.grappling = true;
            player.grappleX = message.x
            player.grappleY = message.y
        }

    }

}