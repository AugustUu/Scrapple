import Colyseus, { Client, Room } from "colyseus.js";
import { NetworkClient } from "./NetworkClient";
import { EventEmitter, GameEvent } from "excalibur";
import * as NeworkEvents from "./NetworkEvents";

export class Networking {

    private static colyClient: Client = new Client("ws://localhost:2567");
    static client: NetworkClient = new NetworkClient();
    static events = new EventEmitter<NeworkEvents.Events>();


    static connect(room_id: string, playerName: string, color: string) {
        Networking.colyClient.joinById(room_id, { name: playerName, color: color }).then((room) => {
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room)
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static quickPlay(playerName: string, color: string) {
        fetch("http://localhost:2567/quickplay",{ mode: 'cors',}).then((resp) => {
            if(resp.ok){
                resp.json().then((server) => {
                    Networking.connect(server.id,playerName,color)
                })
            }
        })
    }

    static disconect() {
        Networking.client.room?.leave()
    }

    static create(playerName: string,color: string) {
        Networking.colyClient.create("GameRoom", { name: playerName,color:color }).then((room) => {
            this.events.emit("connected", new NeworkEvents.ServerConnected(room));
            this.client.onJoin(room)
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static getLocalState(){
        return Networking.client.room.state.players.get(Networking.client.clientId)
    }

    static getLocalClient(){
        return Networking.client.room.state.clients.get(Networking.client.clientId)
    }
} 