import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { player } from './player';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';
import { Peer } from "peerjs";


export const app = new Application();

async function init(){

    
    await app.init({
        backgroundColor: 0x777777,
        resizeTo: window
    });

    document.body.appendChild(app.canvas);
    const container = new Container();
    app.stage.addChild(container);

    InputSystem.init();

    const peer = new Peer("testingtesting123");
    const conn = peer.connect("testingtesting1234");
    conn.on("open", () => {
        conn.send("hi!");
    });

    peer.on("connection", (conn) => {
        conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
        });
        conn.on("open", () => {
            conn.send("hello!");
        });
    });

    new player(100,100);

}

init()

console.log("starting game?")
