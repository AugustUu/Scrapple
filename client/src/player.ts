import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app, ground, cursor_point } from ".";
import { InputSystem } from "./util/InputSystem";
import { Vector2 } from "./util/MathUtils";
import { KinematicPhysicsObject } from "./Physics/PhysicsObject";
import { World } from "./Physics/world";
import { RigidBody, JointData, ImpulseJoint } from "@dimforge/rapier2d-compat";


export class player{
    sprite: Graphics;
    made = false;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    joint: ImpulseJoint;
    //window_offset: {x:number, y:number};
    constructor(x: number, y: number) {
        
        this.sprite = new Graphics()
            .circle(0, 0, 20)
            .fill(0x800080);
        
        this.physics_object = new KinematicPhysicsObject(x, y, 2, World, this.sprite);
        this.rb = this.physics_object.rigidBody;
        
        app.stage.addChild(this.sprite);

        app.ticker.add(delta => this.gameLoop(delta))

        this.sprite.eventMode = "static"
        this.sprite.hitArea = app.screen;

        this.joint = World.world.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), this.rb, ground.rigidBody, true)
        World.world.removeImpulseJoint(this.joint, true)
    }
    

    gameLoop(delta: Ticker){
        this.play(delta);
        /*this.sprite.x = this.rb.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rb.translation().y * -10 + this.window_offset.y;*/
        this.sprite.rotation = -this.rb.rotation();
        /*if(this.rb.linvel().x > 20){
            this.rb.setLinvel({x: 20, y: this.rb.linvel().y}, false); 
        }         
        if(this.rb.linvel().x < -20){
            this.rb.setLinvel({x: -20, y: this.rb.linvel().y}, false);
        }*/
    }
    
    play(delta: Ticker) {
        cursor_point.rigidBody.setTranslation(InputSystem.getMousePos(), true) //

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
        
        if(InputSystem.isKeyDown('k')){
            if(!this.made){
                let ground_offset = new Vector2(ground.rigidBody.translation().x - this.rb.translation().x, ground.rigidBody.translation().y - this.rb.translation().y)
                ground_offset = ground_offset.rotate(-this.rb.rotation())
                let params = JointData.revolute({ x: ground_offset.x, y: ground_offset.y }, { x: 0.0, y: 0.0 });
                this.joint = World.world.createImpulseJoint(params, this.rb, ground.rigidBody, true);
                this.made = true
            }
        }
        else{
            if(this.made){
                World.world.removeImpulseJoint(this.joint, true)
                this.made = false;
            }
        }

        //this.rb.setLinvel({x:Math.min(Math.max(this.rb.linvel().x, -90), 90), y:this.rb.linvel().y}, true);

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