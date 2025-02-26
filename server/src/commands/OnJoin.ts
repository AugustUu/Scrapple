import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { PlayerClient } from "../State";



export class OnJoinCommand extends Command<GameRoom, { client: Client, options: any }> {

    execute({ client, options } = this.payload) {

        console.log(client.sessionId, "joined!", options);
        if (options && options.name) {
            this.state.clients.set(client.sessionId, new PlayerClient(options.name, client.id, this.state.clients.size == 0));
            client.send(S2CPackets.InitClient, {})
            //this.state.players.set(client.sessionId, new Player(options.name, client.id, idList[0]));
        }
    }

}