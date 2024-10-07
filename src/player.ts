import { Application, Graphics } from "pixi.js";
import { app } from ".";

export class player {
    sprite: Graphics;

    constructor(x: number, y: number) {
        document.addEventListener("keypress", (event) => { this.move(event) })
        this.sprite = new Graphics()
            .rect(0, 0, 100, 100)
            .fill(0xff0000);

        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);

        app.ticker.add((time) => {
            //this.sprite.x = Math.random()*100;
        })

        this.sprite.on('pointerdown', (event) => {
            this.sprite.x = event.global.x - 50;
            this.sprite.y = event.global.y - 50;
        })
        this.sprite.eventMode = "static"
    }

    move(event:KeyboardEvent) {
        switch (event.key){
            case "a":
                this.sprite.x -= 100;
                break;
            case "d":
                this.sprite.x += 100;
                break;
            case "s":
                this.sprite.y += 100;
                break;
            case "w":
                this.sprite.y -= 100;
                break;
        }
    };


}