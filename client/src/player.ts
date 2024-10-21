import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from ".";
import { InputSystem } from "./util/InputSystem";
import { Vector2 } from "./util/MathUtils";
import { KinematicPhysicsObject } from "./Physics/PhysicsObject";
import { World } from "./Physics/world";




export class player{
    sprite: Graphics;
    
    constructor(x: number, y: number) {
        
        this.sprite = new Graphics()
            .rect(0, 0, 40, 40)
            .fill(0xff0000);
        
            let PhysicsObject = new KinematicPhysicsObject(0, 0, 1, 1, World, this.sprite);

        this.sprite.x = x;
        this.sprite.y = y;

        app.stage.addChild(this.sprite);

        app.ticker.add(delta => this.gameLoop(delta))

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
            var line = new Graphics();
            line.moveTo(this.sprite.x, this.sprite.y)
            var end = new Vector2(InputSystem.getMousePos().x - this.sprite.x, InputSystem.getMousePos().y - this.sprite.y).normalized().mul(100000);
            //line.lineTo(end.x + this.sprite.x, end.y + this.sprite.y);
            line.lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y)
            line.stroke({ width: 1, color:0x000000 })
            app.stage.addChild(line);
        }
    };

    
}