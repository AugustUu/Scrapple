import Colyseus, { Client, Room } from "colyseus.js";
import { NetworkClient } from "./NetworkClient";
import { EventEmitter, GameEvent } from "excalibur";
import * as NeworkEvents from "./NetworkEvents";

export class Networking {

    private static colyClient: Client = new Client("ws:/localhost:2567/");
    static client: NetworkClient = new NetworkClient();
    static events = new EventEmitter<NeworkEvents.Events>();


    static connect(room_id: string, playerName: string) {
        Networking.colyClient.joinById(room_id, { name: playerName }).then((room) => {
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room)
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static disconect() {
        Networking.client.room?.leave()
    }

    static create(playerName: string) {
        Networking.colyClient.create("GameRoom",{ name: playerName }).then((room) => {
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room)
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }
} 