import Colyseus, { Client, Room } from "colyseus.js";
import { GameState, StateSystem } from "../util/StateSystem";
import { NetworkClient } from "./NetworkClient";


export class Network {

    private static colyClient: Client = new Client("ws://localhost:2567/");
    static client: NetworkClient = new NetworkClient();
    static state: any = null;



    static connect(room_id: string) {
        Network.colyClient.joinById(room_id).then((room) => { this.client.onJoin(room) }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static create() {
        Network.colyClient.create("GameRoom").then((room) => { this.client.onJoin(room) }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }
} 