import Peer, { DataConnection } from "peerjs";
import * as crypto from "node:crypto";


export class Client{
    static me: Peer;

    static conn: DataConnection;
    static peer: Peer;

    static init(){
        this.me = new Peer(window.crypto.randomUUID());
    }
    
    static connect(peer_id: string){
        this.peer = new Peer(peer_id)
        this.conn = this.me.connect(peer_id);
        console.log("connecting to " + peer_id)

        this.conn.on("open", () => {
            this.conn.send("Opened Connection");
        });

        this.peer.on("connection", (conn) => {
            conn.on("data", (data) => {
                // Will print 'hi!'
                console.log(data);
            });
            conn.on("open", () => {
                conn.send("hello!");
            });
        });


    }
}