import { Application, Graphics } from "pixi.js";
import { app } from ".";

export class player {
    sprite: Graphics | undefined;

    constructor(x:number , y:number){
        this.sprite = new Graphics()
        .rect(x, y, 100, 100)
        .fill(0xff0000);

        app.stage.addChild(this.sprite);
    }
    

}