import Colyseus, { Client } from "colyseus.js";


export class MultiPlayerClient {
   
    static client: Client = new Client("ws://localhost:2567/");

    static init() {
        console.log(this.client)
    }


    static connect(room_id: string) {
        this.client.joinById(room_id).then(room => {
            console.log(room.sessionId, "joined", room.name);
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }

    static create() {
        this.client.joinById("GameRoom").then(room => {
            console.log(room.sessionId, "joined", room.name);
        }).catch(e => {
            console.log("JOIN ERROR", e);
        });
    }
} 