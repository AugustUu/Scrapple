import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from ".";
import { InputSystem } from "./util/InputSystem";
import { Vector2 } from "./util/MathUtils";
import { KinematicPhysicsObject } from "./Physics/PhysicsObject";
import { World } from "./Physics/world";
import { RigidBody } from "@dimforge/rapier2d-compat";



export class player{
    sprite: Graphics;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    window_offset: {x:number, y:number};
    constructor(x: number, y: number) {
        
        this.sprite = new Graphics()
            .rect(0, 0, 40, 40)
            .fill(0x800080);
        
        this.physics_object = new KinematicPhysicsObject(0, 20, 2, 2, World, this.sprite);
        this.rb = this.physics_object.rigidBody;

        this.sprite.x = this.rb.translation().x * 10;
        this.sprite.y = this.rb.translation().y * 10;

        this.sprite.pivot.x = this.sprite.width / 2
        this.sprite.pivot.y = this.sprite.height / 2

        this.window_offset = {x:window.innerWidth / 2, y:window.innerHeight / 2}
        
        app.stage.addChild(this.sprite);

        app.ticker.add(delta => this.gameLoop(delta))

        this.sprite.eventMode = "static"
        this.sprite.hitArea = app.screen;
    }
    

    gameLoop(delta: Ticker){
        this.play(delta);
        this.sprite.x = this.rb.translation().x * 10 + this.window_offset.x//- 20;
        this.sprite.y = this.rb.translation().y * -10 + this.window_offset.y//- 62;
        this.sprite.rotation = -this.rb.rotation();
    }

    play(delta: Ticker) {
        if(InputSystem.isKeyDown('a')){
            this.rb.setLinvel({x:this.rb.linvel().x - 0.5, y:this.rb.linvel().y}, true);
        }
        if(InputSystem.isKeyDown('d')){
            this.rb.setLinvel({x:this.rb.linvel().x + 0.5, y:this.rb.linvel().y}, true);
        }
        if(InputSystem.isKeyDown('s')){
            this.rb.setLinvel({x:this.rb.linvel().x, y:Math.min(this.rb.linvel().y, -15)}, true);
        }
        if(InputSystem.isKeyDown('w')){
            this.rb.setLinvel({x:this.rb.linvel().x, y:Math.max(this.rb.linvel().y, 15)}, true);
        }
        

        this.rb.setLinvel({x:Math.min(Math.max(this.rb.linvel().x, -30), 30), y:this.rb.linvel().y}, true);

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