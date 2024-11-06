import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from ".";
import { InputSystem } from "./util/InputSystem";
import { Vector2 } from "./util/MathUtils";
import { KinematicPhysicsObject } from "./Physics/PhysicsObject";
import { World } from "./Physics/world";
import { RigidBody, Ray, ColliderDesc, QueryFilterFlags } from "@dimforge/rapier2d-compat";



export class player{
    sprite: Graphics;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    //colDesc: ColliderDesc;
    //window_offset: {x:number, y:number};
    constructor(x: number, y: number) {
        
        this.sprite = new Graphics()
            .circle(0, 0, 20)
            .fill(0x800080);
        
        this.physics_object = new KinematicPhysicsObject(x, y, 2, World, this.sprite);
        this.rb = this.physics_object.rigidBody;
        this.physics_object.collider.setCollisionGroups(0x00020001);
        
        app.stage.addChild(this.sprite);
        app.ticker.add(delta => this.gameLoop(delta))

        this.sprite.eventMode = "static"
        this.sprite.hitArea = app.screen;
    }
    

    gameLoop(delta: Ticker){
        this.handleInput(delta);
        this.sprite.rotation = -this.rb.rotation();
        if(this.rb.linvel().x > 20){
            this.rb.setLinvel({x: 20, y: this.rb.linvel().y}, false);
        }
        if(this.rb.linvel().x < -20){
            this.rb.setLinvel({x: -20, y: this.rb.linvel().y}, false);
        }
    }

    handleInput(delta: Ticker) {
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
            

            let ray = new Ray(this.rb.translation(), new Vector2(((InputSystem.getMousePos().x + window.innerWidth / 2) / 10) - this.rb.translation().x, (-(InputSystem.getMousePos().y + window.innerHeight / 2) / 10) - this.rb.translation().y).normalized());
            let hit = World.world.castRay(ray, 10, false);
            if (hit != null) {
                console.log("doubleewe!")
                var line = new Graphics();
                line.moveTo(this.sprite.x, this.sprite.y)
                var end = new Vector2(InputSystem.getMousePos().x - this.sprite.x, InputSystem.getMousePos().y - this.sprite.y).normalized().mul(100000);
                //line.lineTo(end.x + this.sprite.x, end.y + this.sprite.y);
                line.lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y)
                line.stroke({ width: 1, color:0x000000 })
                app.stage.addChild(line);
                // The first collider hit has the handle `hit.colliderHandle` and it hit after
                // the ray travelled a distance equal to `ray.dir * toi`.
                let hitPoint = ray.pointAt(hit.timeOfImpact); // Same as: `ray.origin + ray.dir * toi`
                console.log("Collider", hit.collider, "hit at point", hitPoint);
            }
            else{
                console.log("erm")
            }
        }
    }

}