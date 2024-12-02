import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import RAPIER from '@dimforge/rapier2d-compat';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';
import { MainMenu } from './ui/MainMenu';
import { World as World } from './physics/World';
import { player } from './game/Player';
import { Room } from './game/Room';



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
    Room.init();
    World.init();
    StateSystem.changeState(GameState.inRoom);




    let lines = new Graphics();
    lines.x = window.innerWidth / 2;
    lines.y = window.innerHeight / 2;
    app.stage.addChild(lines);

    app.ticker.add(() => {
        const { vertices, colors } = World.world.debugRender();
        lines.clear();

        for (let i = 0; i < vertices.length / 4; i += 1) {
            //lines.lineStyle(1.0, color, colors[i * 8 + 3], 0.5, true);
            
            lines.moveTo(vertices[i * 4] * 10, -vertices[i * 4 + 1] * 10).lineTo(vertices[i * 4 + 2] * 10, -vertices[i * 4 + 3] * 10).stroke({ width: 1, color: 0xff0000 });
        }
    });


}

init()

console.log("starting game?")