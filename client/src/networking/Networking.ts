import Colyseus, { Client, Room } from "colyseus.js";
import { NetworkClient } from "./NetworkClient";
import { GameEvent } from "excalibur";
import { EventEmitter } from "stream";

type NeworkEvents = {
    connected:ServerConnected
}

export class ServerConnected extends GameEvent<Colyseus.Room<unknown>> {
    constructor(public target: Colyseus.Room<unknown>) {
        super();
    }
}

export const NeworkEvents = {
    connected: 'connected'
} as const;


export class Networking {

    private static colyClient: Client = new Client("ws://localhost:2567/");
    static client: NetworkClient = new NetworkClient();
    static state: any = null;
    //static events = new EventEmitter<NeworkEvents>();


    static connect(room_id: string) {
        Networking.colyClient.joinById(room_id).then((room) => { this.client.onJoin(room) }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static create() {
        Networking.colyClient.create("GameRoom").then((room) => { this.client.onJoin(room) }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }
} 