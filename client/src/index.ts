import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import RAPIER from '@dimforge/rapier2d-compat';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';
import { MainMenu } from './ui/MainMenu';
import { World as World } from './Physics/world';
import { player } from './player';
import { KinematicPhysicsObject } from './Physics/PhysicsObject'
import { StaticPhysicsObject } from './Physics/PhysicsObject';



export const app = new Application();
export let ground:StaticPhysicsObject;
export let cursor_point:KinematicPhysicsObject;
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
    StateSystem.changeSate(GameState.playing);
    

    let circoid = new KinematicPhysicsObject(0.0, 10.0, 1.0, World, new Graphics().circle(0, 0, 10).fill(0xf998fa));
    ground = new StaticPhysicsObject(0.0, 0.0, 100.0, 2.0, World, new Graphics().rect(0, 0, 2000, 40).fill(0xffffff));
    cursor_point = new KinematicPhysicsObject(0.0, 0.0, 1.0, World, new Graphics().rect(0, 0, 20, 20).fill(0xffffff)); // debug



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



    

    //new player(100,100);

}

init()

console.log("starting game?")
