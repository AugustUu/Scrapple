import { Application, Graphics } from "pixi.js";
import { app } from ".";

export class player {
    sprite: Graphics;

    constructor(x: number, y: number) {
        this.sprite = new Graphics()
            .rect(0, 0, 100, 100)
            .fill(0xff0000);

        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);

        app.ticker.add((time) => {
            //this.sprite.x = Math.random()*100;
        })

        this.sprite.on('globalpointermove', (event) => {
            console.log(event)
        })
        this.sprite.eventMode = "static"
    }


}