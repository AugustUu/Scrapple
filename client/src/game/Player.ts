import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { InputSystem } from "../util/InputSystem";
import { Vector2, MathUtils } from "../util/MathUtils";
import { KinematicPhysicsObject } from "../physics/PhysicsObject";
import { World } from "../physics/World";
import { RigidBody, JointData, ImpulseJoint, Ray, Collider } from "@dimforge/rapier2d-compat";
import { bullet } from "./Bullet";
import { Input } from "@pixi/ui";


export class player {
    sprite: Graphics;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    col: Collider;
    joint: ImpulseJoint;
    grapple_line = new Graphics()
    aim_line = new Graphics()
    constructor(x: number, y: number) {

        this.sprite = new Graphics()
            .circle(0, 0, 20)
            .fill(0x800080);

        this.physics_object = new KinematicPhysicsObject(x, y, 2, World, this.sprite);
        this.rb = this.physics_object.rigidBody;
        this.col = this.physics_object.collider;
        //part of group 1 (0010) and interacts with 0 and 1 (0011)
        this.col.setCollisionGroups(0x00020007)

        app.stage.addChild(this.sprite);
        app.ticker.add(delta => this.gameLoop(delta))

        this.sprite.eventMode = "static"
        this.sprite.hitArea = app.screen;

        this.joint = World.world.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), this.rb, this.rb, true)
        World.world.removeImpulseJoint(this.joint, true)

        app.stage.addChild(this.grapple_line);
        app.stage.addChild(this.aim_line);
    }


    gameLoop(delta: Ticker) {
        this.handleInput(delta);
        this.sprite.rotation = -this.rb.rotation();

        app.stage.position.x = (-this.sprite.x + window.innerWidth / 2)
        app.stage.position.y = (-this.sprite.y + window.innerHeight / 2)

        // max valocity 
        //this.rb.setLinvel({x:Math.min(Math.max(this.rb.linvel().x, -90), 90), y:this.rb.linvel().y}, true);


    }

    handleInput(delta: Ticker) {
        //this.line.clear();
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
            let jumpRay = new Ray(this.rb.translation(), {x:0, y:-1})
            //doesn't actually touch the ground but gets close enough
            let hit = World.world.castRay(jumpRay, 2.3, false, undefined, undefined, undefined, this.rb);
            
            if(hit != null){
                if(hit.collider.collisionGroups() == 0x00010007){
                    this.rb.setLinvel({ x: this.rb.linvel().x, y: Math.max(this.rb.linvel().y, 20) }, true);
                    //this.line.moveTo(this.sprite.x, this.sprite.y).lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y).stroke({ width: 1, color: 0x000000 })
                }
                else{
                    console.log("no jump")
                }
            }
            
        }

        this.grapple_line.clear();
        this.aim_line.clear();
        let rapier_mouse = MathUtils.screenToRapier(InputSystem.getMousePos())
        let ray = new Ray(this.rb.translation(), rapier_mouse.sub(this.rb.translation()).normalized());
        let hit = World.world.castRay(ray, 1000, false, undefined, undefined, undefined, this.rb);
        if (hit != null) {
            let hit_point = ray.pointAt(hit.timeOfImpact); 
            if (InputSystem.isMouseDown(2)) { // todo: make this only check the frame mouse is clicked, rather than every frame it is (augusts job)
                
                //console.log("Collider", hit.collider, "hit at point", hitPoint); 
                if (!this.joint.isValid()) {
                    this.generateJoint(hit.collider.parent(), hit_point)
                }
            }
            else{
                let line_start = MathUtils.rapierToScreen(this.rb.translation())
                let line_end = MathUtils.rapierToScreen(hit_point)
                this.aim_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 3, color: 0xffffff })
            }
            if(InputSystem.isMouseDown(0)){
                if(hit.collider.collisionGroups() == 0x00010007){
                    console.log("hit static object")
                }
                if(hit.collider.collisionGroups() == 0x00040007){
                    console.log("hit kinematicphysicsobject")
                }
                if(hit.collider.collisionGroups() == 0x00020007){
                    console.log("hit player")
                }

                let line_start = MathUtils.rapierToScreen(this.rb.translation())
                let line_end = MathUtils.rapierToScreen(hit_point)
                

            }
        }
        else{
            if (!this.joint.isValid()) {
                let line_start = MathUtils.rapierToScreen(this.rb.translation())
                let line_end = rapier_mouse.sub(this.rb.translation()).normalized().scale(300) // kinda stupid probably rework later
                line_end = MathUtils.rapierToScreen(line_end.add(this.rb.translation()))
                this.aim_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 2, color: 0xaaaaaa })
            }
        }
        /*else {
            console.log("miss")
        }*/

        if(this.joint.isValid()){
            if(!InputSystem.isMouseDown(2)){ // this feels dumb? but i can't think of another way to do it so w/e
                World.world.removeImpulseJoint(this.joint, true)
            }
            else{
                let line_start = MathUtils.rapierToScreen({x:this.rb.translation().x, y:this.rb.translation().y})
                let rot_anchor2 = new Vector2(this.joint.anchor2()).rotate(this.joint.body2().rotation())
                let line_end = MathUtils.rapierToScreen({x:this.joint.body2().translation().x + rot_anchor2.x, y:this.joint.body2().translation().y + rot_anchor2.y})
                this.grapple_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 4, color: 0x000000 })
            }
        }
    }

    generateJoint(target: RigidBody | null, hitPoint: {x:number, y:number}) {
        if(target != null){ // should never be null?
            let hit_point_vector = new Vector2(hitPoint)
            let start_offset = hit_point_vector.sub(this.rb.translation())
            start_offset = start_offset.rotate(-this.rb.rotation())
            let end_offset = hit_point_vector.sub(target.translation())
            end_offset = end_offset.rotate(-target.rotation())
            let params = JointData.revolute(start_offset, end_offset);
            this.joint = World.world.createImpulseJoint(params, this.rb, target, true);
        }
    }
}
