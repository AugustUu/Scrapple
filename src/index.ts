import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { player } from './player';
import { GameState, StateSystem } from './util/StateSystem';
import { EventSystem } from './util/EventSystem';
import { InputSystem } from './util/InputSystem';

export const app = new Application();

async function init(){

    
    await app.init({
        backgroundColor: 0x777777,
        resizeTo: window
    });
    InputSystem.init();

    document.body.appendChild(app.canvas);

    const container = new Container();
    app.stage.addChild(container);

    app.ticker.add(delta => {
        console.log(InputSystem.isMouseDown(0));
    })

    new player(100,100);

}

init()

console.log("starting game?")
