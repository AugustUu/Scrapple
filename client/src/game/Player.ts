import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { InputSystem } from "../util/InputSystem";
import { Vector2 } from "../util/MathUtils";
import { KinematicPhysicsObject } from "../physics/PhysicsObject";
import { World } from "../physics/World";
import { RigidBody, JointData, ImpulseJoint, Ray } from "@dimforge/rapier2d-compat";


export class player {
    sprite: Graphics;
    made = false;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    joint: ImpulseJoint;
    line = new Graphics()
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

        this.joint = World.world.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), this.rb, this.rb, true)
        World.world.removeImpulseJoint(this.joint, true)

        this.line
        app.stage.addChild(this.line);
    }


    gameLoop(delta: Ticker) {
        this.handleInput(delta);
        /*this.sprite.x = this.rb.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rb.translation().y * -10 + this.window_offset.y;*/
        this.sprite.rotation = -this.rb.rotation();

        app.stage.position.x = (-this.sprite.x + window.innerWidth / 2)
        app.stage.position.y = (-this.sprite.y + window.innerHeight / 2)
        /*if(this.rb.linvel().x > 20){
            this.rb.setLinvel({x: 20, y: this.rb.linvel().y}, false); 
        }         
        if(this.rb.linvel().x < -20){
            this.rb.setLinvel({x: -20, y: this.rb.linvel().y}, false);
        }*/
    }

    handleInput(delta: Ticker) {

        if (InputSystem.isKeyDown('a')) {
            this.rb.setLinvel({ x: this.rb.linvel().x - 0.5, y: this.rb.linvel().y }, true);
        }
        if (InputSystem.isKeyDown('d')) {
            this.rb.setLinvel({ x: this.rb.linvel().x + 0.5, y: this.rb.linvel().y }, true);
        }
        if (InputSystem.isKeyDown('s')) {
            this.rb.setLinvel({ x: this.rb.linvel().x, y: Math.min(this.rb.linvel().y, -15) }, true);
        }
        if (InputSystem.isKeyDown('w')) {
            this.rb.setLinvel({ x: this.rb.linvel().x, y: Math.max(this.rb.linvel().y, 15) }, true);
        }

        if (InputSystem.isMouseDown(2)) {
            if (!this.made) {
                //this.generateJoint(ground.rigidBody)
                this.made = true
            }
        }
        else {
            if (this.made) {
                World.world.removeImpulseJoint(this.joint, true)
                this.made = false;
            }
        }

        //this.rb.setLinvel({x:Math.min(Math.max(this.rb.linvel().x, -90), 90), y:this.rb.linvel().y}, true);

        this.line.clear();
        if (InputSystem.isMouseDown(0)) {
            this.line.moveTo(this.sprite.x, this.sprite.y).lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y).stroke({ width: 1, color: 0x000000 })
            //var end = new Vector2(InputSystem.getMousePos().x - this.sprite.x, InputSystem.getMousePos().y - this.sprite.y).normalized().mul(100000);
            //line.lineTo(end.x + this.sprite.x, end.y + this.sprite.y);

            let ray = new Ray(this.rb.translation(), new Vector2(((InputSystem.getMousePos().x + window.innerWidth / 2) / 10) - this.rb.translation().x, (-(InputSystem.getMousePos().y + window.innerHeight / 2) / 10) - this.rb.translation().y).normalized());
            let hit = World.world.castRay(ray, 10, false);
            if (hit != null) {
                console.log("doubleewe!")
                var line = new Graphics();
                line.moveTo(this.sprite.x, this.sprite.y)
                var end = new Vector2(InputSystem.getMousePos().x - this.sprite.x, InputSystem.getMousePos().y - this.sprite.y).normalized().mul(100000);
                //line.lineTo(end.x + this.sprite.x, end.y + this.sprite.y);
                line.lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y)
                //line.stroke({ width: 1, color:0x000000 })
                app.stage.addChild(line);
                // The first collider hit has the handle `hit.colliderHandle` and it hit after
                // the ray travelled a distance equal to `ray.dir * toi`.
                let hitPoint = ray.pointAt(hit.timeOfImpact); // Same as: `ray.origin + ray.dir * toi`
                console.log("Collider", hit.collider, "hit at point", hitPoint);
            }
            else {
                console.log("erm")
            }
        }


    }

    generateJoint(target: RigidBody) {
        let target_offset = new Vector2(target.translation().x - this.rb.translation().x, target.translation().y - this.rb.translation().y)
        target_offset = target_offset.rotate(-this.rb.rotation())
        let params = JointData.revolute({ x: target_offset.x, y: target_offset.y }, { x: 0.0, y: 0.0 });
        this.joint = World.world.createImpulseJoint(params, this.rb, target, true);
    }
}
