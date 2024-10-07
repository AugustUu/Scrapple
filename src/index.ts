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
    /*const circle = app.stage.addChild(
        new Graphics().circle(0, 0, 8).fill({ color: 0xffffff }).stroke({ color: 0x111111, alpha: 0.87, width: 1 }),
    );

    circle.position.set(app.screen.width / 2, app.screen.height / 2);

    // Enable interactivity!
    app.stage.eventMode = 'static';

    // Make sure the whole canvas area is interactive, not just the circle.
    app.stage.hitArea = app.screen;

    // Follow the pointer
    app.stage.addEventListener('pointermove', (e) =>
    {
        circle.position.copyFrom(e.global);
    });*/
}

init()

console.log("starting game?")
