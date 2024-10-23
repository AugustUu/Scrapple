import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import RAPIER from '@dimforge/rapier2d-compat';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';
import { Peer } from "peerjs";
import { MainMenu } from './ui/MainMenu';
import { Client } from './network/client';
import { World as World } from './Physics/world';
import { player } from './player';
import { KinematicPhysicsObject } from './Physics/PhysicsObject'
import { StaticPhysicsObject } from './Physics/PhysicsObject';



export const app = new Application();

async function init() {


    await app.init({
        backgroundColor: 0x777777,
        resizeTo: window
    });

    await RAPIER.init();

    document.body.appendChild(app.canvas);
    const container = new Container();
    app.stage.addChild(container);


    MainMenu.init();

    InputSystem.init();
    //Client.init()
    World.init();

    let cuboid = new KinematicPhysicsObject(0.0, 10.0, 1.0, 1.0, World, new Graphics);
    let ground = new StaticPhysicsObject(0.0, 0.0, 100.0, 1.0, World, new Graphics);

    /*let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 1);
    World.world.createCollider(groundColliderDesc);

    let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 10.0);
    let rigidBody = World.world.createRigidBody(rigidBodyDesc);

    let colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1);
    let collider = World.world.createCollider(colliderDesc, rigidBody);

    let rigidBodySprite = new Graphics().rect(100, 0, 100, 100).fill(0xff0000);
    let groundSprite = new Graphics().rect(0, 500, 1000, 100).fill(0x0000ff);*/

    new player(0, 20);

    let lines = new Graphics();
    lines.x = window.innerWidth / 2;
    lines.y = window.innerHeight / 2;

    app.stage.addChild(lines);

    app.ticker.add(() => {
        const { vertices, colors } = World.world.debugRender();


        lines.clear();

        for (let i = 0; i < vertices.length / 4; i += 1) {

            //lines.lineStyle(1.0, color, colors[i * 8 + 3], 0.5, true);
            lines.moveTo(vertices[i * 4] *10, -vertices[i * 4 + 1] *10).lineTo(vertices[i * 4 + 2] *10, -vertices[i * 4 + 3] *10).stroke({ width: 1, color: 0xff0000 });


        }


    });


    //container.addChild(rigidBodySprite)
    //container.addChild(groundSprite)


    //StateSystem.changeSate(GameState.menu);



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
