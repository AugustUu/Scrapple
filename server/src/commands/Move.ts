import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";




export class MoveCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            player.oldPosition = player.position.clone()
            player.position.x = message.x
            player.position.y = message.y
            player.rotation = message.rotation

            let radius = 2000 - ((Date.now() - this.state.game.roundStartTime)/5)/15.625
                


            if((player.position.x**2 + player.position.y**2) > radius**2){
                player.health -= (30/64)
            }

            if(player.health <= 0){
                this.state.players.delete(player.id);
                this.room.clients.getById(player.id).send(S2CPackets.Killed, {})
            }

        }


    }

}