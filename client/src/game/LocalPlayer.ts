import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Util, Vector, Line } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint } from "../util"
import { engine } from "..";
import { Network } from "inspector/promises";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";

export class LocalPlayer extends Actor {
    public health: number = 100;
    joint!: ImpulseJoint;
    lineActor: Actor;

    constructor(x: number, y: number) {
        super({ x: x, y: y, radius: 20, color: new Color(128, 0, 128), anchor: Vector.Half });

        this.lineActor = new Actor({ pos: Vector.Zero })
        this.lineActor.graphics.anchor = Vector.Zero
        let line = new Line({
            start: Vector.Zero,
            end: Vector.Zero,
            color: Color.Black,
            thickness: 2
        })
        this.lineActor.graphics.add(line)
        engine.add(this.lineActor)

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)

        this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.ball(2).setCollisionGroups(0x00020007), rigidBody.body))
    }

    public update(engine: Engine, delta: number) {

        let rb = this.get(RigidBodyComponent).body;
        let col = this.get(ColliderComponent).collider;

        if (engine.input.keyboard.isHeld(Keys.A)) {
            rb.setLinvel({ x: rb.linvel().x - 4, y: rb.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            rb.setLinvel({ x: rb.linvel().x + 4, y: rb.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            rb.setLinvel({ x: rb.linvel().x, y: Math.min(rb.linvel().y, -75) }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.W)) {
            let jumpRay = new Ray(rb.translation(), { x: 0, y: -1 })
            //doesn't actually touch the ground but gets close enough
            let hit = PhysicsSystem.physicsWorld.castRay(jumpRay, 2, true, undefined, undefined, undefined, rb);

            if (hit != null) {
                if (hit.collider.collisionGroups() == 0x00010007) {
                    rb.setLinvel({ x: rb.linvel().x, y: Math.max(rb.linvel().y, 60) }, true);
                    //this.line.moveTo(this.sprite.x, this.sprite.y).lineTo(InputSystem.getMousePos().x, InputSystem.getMousePos().y).stroke({ width: 1, color: 0x000000 })
                }
                else {
                    console.log("no jump")
                }
            }
        }

        if (this.joint == null) { // this is so stupid
            this.joint = PhysicsSystem.physicsWorld.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), rb, rb, true)
            PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
        }

        //debug
        //console.log(this.lineActor.graphics.getGraphic("line"))

        let rapier_mouse = MathUtils.excToRapier(engine.input.pointers.primary.lastWorldPos)
        let ray = new Ray(rb.translation(), rapier_mouse.sub(rb.translation()).normalized());
        let hit = PhysicsSystem.physicsWorld.castRay(ray, 1000, false, undefined, undefined, undefined, rb);
        if (hit != null) {
            let hit_point = ray.pointAt(hit.timeOfImpact);
            if (engine.input.pointers.isDown(0)) { // todo: make this only check the frame mouse is clicked, rather than every frame it is (augusts job)

                //console.log("Collider", hit.collider, "hit at point", hitPoint); 
                if (!this.joint.isValid()) {
                    let newJoint = generateRevoluteJoint(hit.collider.parent(), rb, hit_point)
                    if (newJoint != undefined) {
                        this.joint = newJoint
                    }
                }
            }
            else {
                /*let line_start = MathUtils.rapierToExc(rb.translation())
                let line_end = MathUtils.rapierToExc(hit_point)
                this.aim_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 3, color: 0xffffff })*/ //old pixi line code
            }
            if (engine.input.pointers.isDown(0)) {
                /*if(hit.collider.collisionGroups() == 0x00010007){
                    console.log("hit static object")
                }
                if(hit.collider.collisionGroups() == 0x00040007){
                    console.log("hit kinematicphysicsobject")
                }
                if(hit.collider.collisionGroups() == 0x00020007){
                    console.log("hit player")
                }*/
            }
        }
        else {
            if (!this.joint.isValid()) {
                /*let line_start = MathUtils.rapierToExc(rb.translation())
                let line_end = rapier_mouse.sub(rb.translation()).normalized().scale(300) // kinda stupid probably rework later
                line_end = MathUtils.rapierToExc(line_end.add(rb.translation()))
                this.aim_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 2, color: 0xaaaaaa })*/ //old pixi line code
            }
        }
        /*else {
            console.log("miss")
        }*/

        if (this.joint.isValid()) {
            if (!engine.input.pointers.isDown(0)) { // this feels dumb? but i can't think of another way to do it so w/e
                PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
            }
            else {
                /*let line_start = MathUtils.rapierToExc({x:rb.translation().x, y:rb.translation().y})
                let rot_anchor2 = new Vector2(this.joint.anchor2()).rotate(this.joint.body2().rotation())
                let line_end = MathUtils.rapierToExc({x:this.joint.body2().translation().x + rot_anchor2.x, y:this.joint.body2().translation().y + rot_anchor2.y})
                this.grapple_line.moveTo(line_start.x, line_start.y).lineTo(line_end.x, line_end.y).stroke({ width: 4, color: 0x000000 })*/ // old pixi line code
            }
        }

        Networking.client.room?.send(C2SPacket.Move, { x: this.pos.x, y: this.pos.y })
        super.update(engine, delta);
    }


}