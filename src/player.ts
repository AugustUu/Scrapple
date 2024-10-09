import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from ".";
import { InputSystem } from "./util/InputSystem";




export class player {
    sprite: Graphics;

    constructor(x: number, y: number) {
        this.sprite = new Graphics()
            .rect(0, 0, 100, 100)
            .fill(0xff0000);

        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);

        app.ticker.add(delta => this.gameLoop(delta))

        this.sprite.on('pointerdown', (event) => {
            this.sprite.x = event.global.x - 50;
            this.sprite.y = event.global.y - 50;
        })
        this.sprite.eventMode = "static"
        this.sprite.hitArea = app.screen;

    }

    gameLoop(delta: Ticker){
        this.play(delta);
    }

    play(delta: Ticker) {
        if(InputSystem.isKeyDown('a')){
            this.sprite.x -= 3;
        }
        if(InputSystem.isKeyDown('d')){
            this.sprite.x += 3;
        }
        if(InputSystem.isKeyDown('s')){
            this.sprite.y += 3;
        }
        if(InputSystem.isKeyDown('w')){
            this.sprite.y -= 3;
        }

        if(InputSystem.isMouseDown(0)){
            this.sprite.x = InputSystem.getMousePos().x;
            this.sprite.y = InputSystem.getMousePos().y;
        }
    };

    
}