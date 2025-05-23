import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";



export class OnLeaveCommand extends Command<GameRoom, { client: Client}> {

    execute({ client } = this.payload) {

        //console.log(client.sessionId, "left!");
        this.state.clients.delete(client.sessionId);
        if (this.state.players.has(client.sessionId)) {
            this.state.players.delete(client.sessionId);
        }
        
    }

}