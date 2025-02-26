import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { PlayerClient } from "../State";



export class OnLeaveCommand extends Command<GameRoom, { client: Client}> {

    execute({ client } = this.payload) {

        console.log(client.sessionId, "left!");
        if(this.state.clients.get((client.sessionId)).host && this.state.clients.size > 1){
            this.state.clients.values().next().value.host = true;
        }
        this.state.clients.delete(client.sessionId);
        if (this.state.players.has(client.sessionId)) {
            this.state.players.delete(client.sessionId);
        }
        
    }

}