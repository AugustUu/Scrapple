import { Application, Assets, Container, Graphics, Sprite, Texture, Ticker } from 'pixi.js';

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

    obj = new Graphics()
    .circle(100, 10, 10)
    .fill(0xff0000);

    app.stage.addChild(obj);
    app.ticker.add((delta) => update(delta));
}
let osbj = 0.0001;
let osjb = 0;
function update(delta: Ticker){
    obj.y = Math.sin(osjb) * 100 + 100;
    obj.x = Math.cos(osjb) * 100 + 20;
    osbj += 0.0001;
    osjb += osbj;
}
init()

console.log("starting game?")
