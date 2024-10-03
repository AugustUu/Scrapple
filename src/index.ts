import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';
import { player } from './player';

export const app = new Application();

let obj: Graphics;
async function init(){
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0x777777,
        resizeTo: window
    });

    document.body.appendChild(app.canvas);

    const container = new Container();
    app.stage.addChild(container);

    new player(100,100);

    //new player(300,100+1);
}

init()

console.log("starting game?")
