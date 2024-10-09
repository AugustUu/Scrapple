import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { player } from './player';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';
import { Peer } from "peerjs";
import { MainMenu } from './MainMenu';


export const app = new Application();

async function init(){

    
    await app.init({
        backgroundColor: 0x777777,
        resizeTo: window
    });

    document.body.appendChild(app.canvas);
    //const container = new Container();
    //app.stage.addChild(container);


    MainMenu.init();

    InputSystem.init();
    StateSystem.changeSate(GameState.menu);

    
/*
    const peer = new Peer("testingtesting123");
    const peer2 = new Peer("testingtesting1234");
    const conn = peer.connect("testingtesting1234");
    const conn2 = peer.connect("testingtesting123");

    console.log(peer,conn)

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

    conn2.on("open", () => {
        conn.send("hi!");
    });

    peer2.on("connection", (conn) => {
        conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
        });
        conn.on("open", () => {
            conn.send("hello!");
        });
    });*/


    //new player(100,100);

}

init()

console.log("starting game?")
