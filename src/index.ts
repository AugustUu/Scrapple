import { Application, Assets, Container, Graphics, Sprite, Texture } from 'pixi.js';

export const app = new Application();


async function init(){
    await app.init({
        resolution: Math.max(window.devicePixelRatio, 2),
        backgroundColor: 0x777777,
        resizeTo: window
    });

    document.body.appendChild(app.canvas);

    const container = new Container();
    app.stage.addChild(container);

    let obj = new Graphics()
    .rect(0, 0, 200, 100)
    .fill(0xff0000);

    app.stage.addChild(obj);
}

init()

console.log("starting game?")
