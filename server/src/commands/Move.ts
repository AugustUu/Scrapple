import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { PlayerClient } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";



export class MoveCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            player.position.x = message.x
            player.position.y = message.y
        }

    }

}