import Peer, { DataConnection } from "peerjs";
import { EventSystem } from "../util/EventSystem";


export class Client {
    static me: Peer;
    static host: DataConnection;

    static init() {
        this.me = new Peer(window.crypto.randomUUID());

        this.me.on("connection", (conn) => {
            conn.on("data", (data) => {
                console.log(data);
            });
            conn.on("open", () => {
                console.log("Client Connected to me")
                conn.send("hello!");
            });
        });

    }

    static connect(hostId: string) {

        this.host = this.me.connect(hostId);
        console.log("connecting to " + hostId)

        this.host.on("open", () => {
            EventSystem.emit("connectedToHost", this.host);

            this.host.send("hello from2: " + this.me.id)
        });



    }
} 