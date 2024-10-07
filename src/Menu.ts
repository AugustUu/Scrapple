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

    title = new Graphics().rect(window.innerWidth / 2, window.innerHeight / 2,500, 200);
}

init()