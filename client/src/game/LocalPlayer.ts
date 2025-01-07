import { Actor, Buttons, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Util, Vector, Line, Transform, ScreenElement } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint, MouseInput } from "../util"
import { engine } from "..";
import { Network } from "inspector/promises";
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { CreateGrappleLine } from "./Entities/GrappleLine";
import { Inventory } from "./Inventory";
import { Pistol } from "./Guns/Pistol";
import { Rifle } from "./Guns/Rifle";
import { Shotgun } from "./Guns/Shotgun";
import { Sniper } from "./Guns/Sniper";

export class LocalPlayer extends Actor {
    public health: number = 100;
    joint!: ImpulseJoint;
    shooting: boolean
    line!: Entity
    jumpHeight: number
    speed: number

    constructor(x: number, y: number) {
        super({ x: x, y: y, radius: 20, color: new Color(128, 0, 128), anchor: Vector.Half });
        this.jumpHeight = 60 + (Inventory.GetUpgrade("Jump").level * 20)
        this.speed = 4 + Inventory.GetUpgrade("Speed").level

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)

        this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.ball(2).setCollisionGroups(0x00020007), rigidBody.body))

        this.shooting = false

        let gun = new Rifle
        Inventory.ChangeGun(gun)

    }

    public update(engine: Engine, delta: number) {

        let rb = this.get(RigidBodyComponent).body;
        let col = this.get(ColliderComponent).collider;

        if (engine.input.keyboard.isHeld(Keys.A)) {
            rb.setLinvel({ x: rb.linvel().x - this.speed, y: rb.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            rb.setLinvel({ x: rb.linvel().x + this.speed, y: rb.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            rb.setLinvel({ x: rb.linvel().x, y: Math.min(rb.linvel().y, -75) }, true);
        }
        if (engine.input.keyboard.wasPressed(Keys.W)) {
            let jumpRay = new Ray(rb.translation(), { x: 0, y: -1 })
            //doesn't actually touch the ground but gets close enough
            let hit = PhysicsSystem.physicsWorld.castRay(jumpRay, 2, true, undefined, undefined, undefined, rb);

            if (hit != null) {
                if (hit.collider.collisionGroups() == 0x00010007) {
                    rb.setLinvel({ x: rb.linvel().x, y: Math.max(rb.linvel().y, this.jumpHeight) }, true);
                }
                else {
                    console.log("no jump")
                }
            }
        }
        if (engine.input.keyboard.isHeld(Keys.R)){
            Inventory.GetGun().Reload()
        }
        if (engine.input.keyboard.wasPressed(Keys.E)) { // just testing, make upgrade later ?
            rb.setLinvel({ x: rb.linvel().x * -0.75, y: rb.linvel().y * -0.75}, true);
        }



        if (this.joint == null) { // this is so stupid
            this.joint = PhysicsSystem.physicsWorld.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), rb, rb, true)
            PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
        }

        let rapier_mouse = MathUtils.excToRapier(engine.input.pointers.primary.lastWorldPos)
        let ray = new Ray(rb.translation(), rapier_mouse.sub(rb.translation()).normalized());
        let hit = PhysicsSystem.physicsWorld.castRay(ray, 1000, false, undefined, undefined, undefined, rb);

        if (hit != null) {
            let hit_point = ray.pointAt(hit.timeOfImpact);
            if (engine.input.keyboard.wasPressed(Keys.Space)) {

                //console.log("Collider", hit.collider, "hit at point", hitPoint); 
                if (!this.joint.isValid()) {

                    let newJoint = generateRevoluteJoint(hit.collider.parent(), rb, hit_point)
                    
                    if (newJoint != undefined) {
                        this.joint = newJoint
                        let endPoint = MathUtils.rapierToExc(hit_point);
                        this.line = CreateGrappleLine(this,endPoint)
                        engine.add(this.line)
                        Networking.client.room?.send(C2SPacket.Grapple, { x: endPoint.x, y: endPoint.y })
                    }
                }
            }
        }

        

        if (this.joint.isValid() && engine.input.keyboard.wasReleased(Keys.Space)) { // this feels dumb? but i can't think of another way to do it so w/e
            this.line.kill() // nice code
            PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
            Networking.client.room?.send(C2SPacket.EndGrapple, {})
        }

        if (MouseInput.mouseButtons.left) {
            if(Inventory.GetGun().automatic){
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Inventory.GetGun().Shoot(angle)
            }
            else if(this.shooting == false){
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Inventory.GetGun().Shoot(angle)
                this.shooting = true;
            }
        }
        if (!MouseInput.mouseButtons.left) {
            this.shooting = false;
        }

        Networking.client.room?.send(C2SPacket.Move, { x: this.pos.x, y: this.pos.y })
        super.update(engine, delta);
    }


}