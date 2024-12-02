import Colyseus, { Client, Room } from "colyseus.js";
import { NetworkClient } from "./NetworkClient";
import { EventEmitter, GameEvent } from "excalibur";
import * as NeworkEvents from "./NetworkEvents";

export class Networking {

    private static colyClient: Client = new Client("ws://localhost:2567/");
    static client: NetworkClient = new NetworkClient();
    static state: any = null;
    static events = new EventEmitter<NeworkEvents.Events>();


    static connect(room_id: string) {
        Networking.colyClient.joinById(room_id).then((room) => { 
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room) 
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static create() {
        Networking.colyClient.create("GameRoom").then((room) => {
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room) 
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }
} 