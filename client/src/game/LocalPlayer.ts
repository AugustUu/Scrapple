import { Actor, Color, Engine, Entity, Keys, Scene, Vector } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import RAPIER, { JointData, ImpulseJoint, Ray, RigidBodyType, Cuboid, Ball, RayColliderHit } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { MathUtils, generateRevoluteJoint as generateRevoluteJoint, MouseInput } from "../util"
import { Networking } from "../networking/Networking";
import { C2SPacket } from "shared/src/networking/Packet";
import { CreateGrappleLine } from "./Entities/GrappleLine";
import { Inventory } from "./Inventory";
import { Pistol} from "shared/src/game/GunManager/Guns/Pistol";
import { Rifle } from "shared/src/game/GunManager/Guns/Rifle";
import { Shotgun } from "shared/src/game/GunManager/Guns/Shotgun";
import { Sniper } from "shared/src/game/GunManager/Guns/Sniper";
import { Minigun } from "shared/src/game/GunManager/Guns/Minigun"
import { Guns, idList } from "shared/src/game/GunManager/GunManager";

export class LocalPlayer extends Actor {
    public health: number = 100;
    joint!: ImpulseJoint;
    shooting: boolean
    grappling: boolean
    line!: Entity
    jumpHeight: number
    speed: number
    radius: number
    grounded: boolean
    lastTimeGrounded: number

    constructor(x: number, y: number) {
        super({name:"localplayer", x: x, y: y, radius: 20, color: new Color(128, 0, 128), anchor: Vector.Half });
        this.jumpHeight = 60 + (Inventory.GetUpgrade("Jump").level * 20)
        this.speed = 8 + Inventory.GetUpgrade("Speed").level
        this.radius = 20
        this.grounded = false


        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)
        
        this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.ball(2).setCollisionGroups(0x00020007), rigidBody.body))
        

        console.log("new", rigidBody)

        this.shooting = false
        this.grappling = false

        Inventory.gun = new Pistol()

    }

    private move(engine: Engine, delta: number) {
        let rigidBody = this.get(RigidBodyComponent).body;
        let col = this.get(ColliderComponent).collider;

        let shape = new Ball(this.radius / 12)
        let hit = PhysicsSystem.physicsWorld.castShape(rigidBody.translation(), rigidBody.rotation(), {x: 0, y: -1}, shape, 0, 0.5, false, undefined, 0x00020007, col)
        if (hit != null) {
            if (hit.collider.collisionGroups() == 0x00010007) {
                if(!this.grounded){
                    this.grounded = true
                }
            }
            else {
                console.log("wrong collisiongroup")
                if(this.grounded){
                    this.grounded = false
                    this.lastTimeGrounded = Date.now()
                }
            }
        }
        else{
            if(this.grounded){
                this.grounded = false
                this.lastTimeGrounded = Date.now()
            }
        }

        if (engine.input.keyboard.isHeld(Keys.A)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x - this.speed, y: rigidBody.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x + this.speed, y: rigidBody.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.min(rigidBody.linvel().y, -50) }, true);
        }
        if (engine.input.keyboard.wasPressed(Keys.W)) {
            if(this.grounded || Date.now() - this.lastTimeGrounded < 100){
                rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.max(rigidBody.linvel().y, this.jumpHeight)}, true);
            }   
        }
        if (engine.input.keyboard.wasReleased(Keys.W)){
            rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.min(rigidBody.linvel().y, rigidBody.linvel().y * 0.25) }, true);
        }

        

        let damping: number
        if(this.grappling){
            damping = 1
        }
        else{
            //rigidBody.setLinvel({x: MathUtils.clamp(rigidBody.linvel().x, -80, 80), y: rigidBody.linvel().y}, true)
            if(!(engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.D))){
                damping = 0.7
            }
            else{
                damping = 0.95
            }
        }
        

        rigidBody.setLinvel({x: rigidBody.linvel().x * damping, y: rigidBody.linvel().y}, true)

        if (engine.input.keyboard.wasPressed(Keys.E)) { // just testing, make upgrade later ?
            rigidBody.setLinvel({ x: rigidBody.linvel().x * -0.75, y: rigidBody.linvel().y * -0.75 }, true);
        }
        
    }

    private grapple(engine: Engine, delta: number) {
        let rigidBody = this.get(RigidBodyComponent).body;

        if(this.get(RigidBodyComponent).killed){
            debugger
        }

        if (this.joint == null) { // this is so stupid
            this.joint = PhysicsSystem.physicsWorld.createImpulseJoint(JointData.revolute({ x: 0.0, y: 0.0 }, { x: 0.0, y: 0.0 }), rigidBody, rigidBody, true)
            PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
        }

        let rapier_mouse = MathUtils.excToRapier(engine.input.pointers.primary.lastWorldPos)
        let ray = new Ray(rigidBody.translation(), rapier_mouse.sub(rigidBody.translation()).normalized());
        let hit = PhysicsSystem.physicsWorld.castRay(ray, 1000, false, undefined, undefined, undefined, rigidBody);

        if (hit != null) {
            let hit_point = ray.pointAt(hit.timeOfImpact);
            if (engine.input.keyboard.wasPressed(Keys.Space)) {

                //console.log("Collider", hit.collider, "hit at point", hitPoint); 
                if (!this.joint.isValid()) {

                    let newJoint = generateRevoluteJoint(hit.collider.parent(), rigidBody, hit_point)

                    if (newJoint != undefined) {
                        this.joint = newJoint
                        let endPoint = MathUtils.rapierToExc(hit_point);
                        this.line = CreateGrappleLine(this, endPoint)
                        this.grappling = true
                        engine.add(this.line)
                        Networking.client.room?.send(C2SPacket.Grapple, { x: endPoint.x, y: endPoint.y })
                    }
                }
            }
        }



        if (this.joint.isValid() && engine.input.keyboard.wasReleased(Keys.Space)) { // this feels dumb? but i can't think of another way to do it so w/e
            this.line.kill() // nice code
            this.grappling = false
            PhysicsSystem.physicsWorld.removeImpulseJoint(this.joint, true)
            Networking.client.room?.send(C2SPacket.EndGrapple, {})
        }
    }


    public update(engine: Engine, delta: number) {

        if(Networking.client.room == null || this.isKilled()){ // who ever designed it so it rarely will update even when killed is a dumbass
            return
        }

        this.move(engine, delta)
        this.grapple(engine, delta)



        if (engine.input.keyboard.wasPressed(Keys.R)) {
            Inventory.Reload()
        }


        if (MouseInput.mouseButtons.left) {
            if (Inventory.GetGun().automatic) {
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Inventory.Shoot(angle)
            } else if (this.shooting == false) {
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Inventory.Shoot(angle)
                this.shooting = true;
            }
        }else{
            this.shooting = false;
        }

        //switch gun hotkeys!!
        if (engine.input.keyboard.wasPressed(Keys.Key1)) {
            Inventory.ChangeGun(idList[0]) 
        }
        if (engine.input.keyboard.wasPressed(Keys.Key2)) {
            Inventory.ChangeGun(idList[1])
        }
        if (engine.input.keyboard.wasPressed(Keys.Key3)) {
            Inventory.ChangeGun(idList[2])
        }
        if (engine.input.keyboard.wasPressed(Keys.Key4)) {
            Inventory.ChangeGun(idList[3])
        }
        if (engine.input.keyboard.wasPressed(Keys.Key5)) {
            Inventory.ChangeGun(idList[4])
        }

        Networking.client.room?.send(C2SPacket.Move, { x: this.pos.x, y: this.pos.y })
        super.update(engine, delta);
    }


}