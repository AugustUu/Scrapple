import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { InputSystem } from "../util/InputSystem";
import { Vector2, MathUtils } from "../util/MathUtils";
import { KinematicPhysicsObject } from "../physics/PhysicsObject";
import { World } from "../physics/World";
import { RigidBody, JointData, ImpulseJoint, Ray, Collider } from "@dimforge/rapier2d-compat";


export class player {
    sprite: Graphics;
    physics_object: KinematicPhysicsObject;
    rb: RigidBody;
    joint: ImpulseJoint;
    line = new Graphics()
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
        this.sprite.rotation = -this.rb.rotation();

        app.stage.position.x = (-this.sprite.x + window.innerWidth / 2)
        app.stage.position.y = (-this.sprite.y + window.innerHeight / 2)

        // max valocity 
        //this.rb.setLinvel({x:Math.min(Math.max(this.rb.linvel().x, -90), 90), y:this.rb.linvel().y}, true);


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

        this.line.clear();
        if (InputSystem.isMouseDown(0)) { // todo: make this only check the frame mouse is clicked, rather than every frame it is (augusts job)
            
            let rapierMouse = MathUtils.screenToRapier(InputSystem.getMousePos())
            let ray = new Ray(this.rb.translation(), new Vector2(rapierMouse.x - this.rb.translation().x, rapierMouse.y - this.rb.translation().y).normalized());
            let hit = World.world.castRay(ray, 1000, false, undefined, undefined, undefined, this.rb);
            if (hit != null) {
                let hitPoint = ray.pointAt(hit.timeOfImpact); 
                console.log("Collider", hit.collider, "hit at point", hitPoint); // remove later smile
                if (!this.joint.isValid()) {
                    this.generateJoint(hit.collider.parent(), hitPoint)
                }
                /*if(hit.collider.parent() != null){
                    let lineStart = MathUtils.rapierToScreen({x:this.joint.anchor1().x + this.rb.translation().x, y:this.joint.anchor1().y + this.rb.translation().y})
                    let lineEnd = MathUtils.rapierToScreen({x:this.joint.anchor1().x + hit.collider.parent().translation().x, y:this.joint.anchor1().y + this.rb.translation().y})
                }
                this.line.moveTo(lineStart.x, lineStart.y).lineTo(lineEnd.x, lineEnd.y).stroke({ width: 1, color: 0x000000 })*/ // fix later ughhhhhhhhhhh how hard is it to make a line
            }
            else {
                console.log("miss")
            }
        }
        else {
            if (this.joint != null) {
                World.world.removeImpulseJoint(this.joint, true)
            }
        }


    }

    generateJoint(target: RigidBody | null, hitPoint: {x:number, y:number}) {
        if(target != null){ // should never be null?
            let start_offset = new Vector2(hitPoint.x - this.rb.translation().x, hitPoint.y - this.rb.translation().y)
            start_offset = start_offset.rotate(-this.rb.rotation())
            let end_offset = new Vector2(hitPoint.x - target.translation().x, hitPoint.y - target.translation().y)
            end_offset = end_offset.rotate(-target.rotation())
            let params = JointData.revolute(start_offset, end_offset);
            this.joint = World.world.createImpulseJoint(params, this.rb, target, true);
        }
    }
}
