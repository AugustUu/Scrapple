import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from ".";

const PIXI = require('pixi.js');
const Keyboard = require('pixi.js-keyboard');
const Mouse = require('pixi.js-mouse');

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
        this.sprite.addEventListener('pointermove', (e)=>{
            this.sprite.position.copyFrom(e)
        })
    }

    gameLoop(delta: Ticker){
        this.play(delta);
        Keyboard.update();
        Mouse.update();
    }
    play(delta: Ticker) {
        if(Keyboard.isKeyDown('KeyA')){
            this.sprite.x -= 3;
        }
        if(Keyboard.isKeyDown('KeyD')){
            this.sprite.x += 3;
        }
        if(Keyboard.isKeyDown('KeyS')){
            this.sprite.y += 3;
        }
        if(Keyboard.isKeyDown('KeyW')){
            this.sprite.y -= 3;
        }

        console.log(Mouse.getPosLocalX() + ", " + Mouse.getPosLocalY());
    };

    
}