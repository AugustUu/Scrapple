import { Actor, Camera, Color, Engine, Entity, Keys, Scene, Vector, Rectangle, GraphicsComponent, TransformComponent, ImageSource, Sprite, BoundingBox } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import RAPIER, { JointData, ImpulseJoint, Ray, RigidBodyType, Cuboid, Ball, RayColliderHit } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { MathUtils, generateRevoluteJoint as generateRevoluteJoint, MouseInput, Vector2 } from "../util"
import { Networking } from "../networking/Networking";
import { C2SPacket, S2CPackets } from "shared/src/networking/Packet";
import { CreateGrappleLine } from "./Entities/GrappleLine";
import { Game } from "../scenes/Game";
import { Guns, idList } from "shared/src/game/GunManager/GunManager";
import { engine } from "..";
import { NetworkUtils } from "../networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Resources } from "../Resources";
import { NetworkClient } from "../networking/NetworkClient";

export class LocalPlayer extends Actor {
    joint!: ImpulseJoint;
    shooting: boolean
    grappling: boolean
    line!: Entity
    jumpHeight: number
    speed: number
    speedMult: number
    radius: number
    grounded: boolean
    lastTimeGrounded: number
    maxGrappleSpeed: number
    grappleCooldown = 0.25 // seconds
    timeLastGrappled = 0
    graphics: GraphicsComponent;

    sprite: Sprite

    airJumps: number
    maxJumps: number
    canDash: boolean

    healthBarEntity: Entity


    constructor(x: number, y: number) {
        super({name:"localplayer", x: x, y: y, /*radius: 20, color: Color.fromHex((document.getElementById('colorpicker') as any).value),*/ anchor: Vector.Half});
        
        this.jumpHeight = 60
        this.speed = 5
        this.speedMult = 1
        this.maxGrappleSpeed = 175

        this.radius = NetworkUtils.getLocalState().radius


        this.maxJumps = 0
        this.airJumps = 0

        //engine.currentScene.camera.strategy.lockToActor(this);
        




        //this.sprite = new ImageSource("/Art/Character.png").toSprite()
        const image = Resources.char1

        /*new ImageSource("/Art/Character.png").load().then((tttt)=>{
            console.log(tttt)
        })*/
        if (image.isLoaded()){
            const sprite = new Sprite({
                image: image,
                destSize: {
                    width: 2.1*this.radius,
                    height: 2.1*this.radius
                }
            })
            this.sprite = sprite
        }
        else{
            console.log("attempted to use unloaded sprite")
        }

        this.graphics.add(this.sprite)


        this.grounded = false

        NetworkUtils.getLocalClient().upgrades.forEach((upgrade) => {
            Upgrades.get(upgrade.upgradeID).clientOnPlayerConstructed(upgrade.level, this)
        })

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)
        
        this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.ball(this.radius/10).setCollisionGroups(0x00020007), rigidBody.body))
        

        console.log("new", rigidBody)

        this.shooting = false
        this.grappling = false

        
        this.canDash = false;

        let healthBar = new Rectangle({ width: 50, height: 5, color: new Color(0, 255, 0) })
        let healthBarGraphics = new GraphicsComponent();
        healthBarGraphics.add(healthBar)
            
            
        let healthBarTransform = new TransformComponent();
        healthBarTransform.pos.y -= 28
            
        this.healthBarEntity = new Entity({name: "healthBar"})
        .addComponent(healthBarGraphics)
        .addComponent(healthBarTransform)

        engine.add(this.healthBarEntity)

    }

    private move(engine: Engine, delta: number) {
        let rigidBody = this.get(RigidBodyComponent).body;
        let col = this.get(ColliderComponent).collider;

        let shape = new Ball(this.radius / 12)
        let hit = PhysicsSystem.physicsWorld.castShape(rigidBody.translation(), rigidBody.rotation(), {x: 0, y: -this.radius/20}, shape, 0, 0.5, false, undefined, 0x00020007, col)
        if (hit != null) {
            if (hit.collider.collisionGroups() == 0x00010007) {
                if(!this.grounded){
                    this.grounded = true;
                    this.airJumps = this.maxJumps;
                    this.canDash = true;
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
        let moveSpeed = this.speed * this.speedMult
        if(!this.grounded && !this.grappling){
            moveSpeed /= 6
        }
        if(this.grappling){
            moveSpeed /= 1.5
        }

        if (engine.input.keyboard.isHeld(Keys.A)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x - moveSpeed, y: rigidBody.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x + moveSpeed, y: rigidBody.linvel().y }, true);
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.min(rigidBody.linvel().y, -50) }, true);
        }
        if(this.grappling){
            if (engine.input.keyboard.isHeld(Keys.W)) {
                rigidBody.setLinvel({ x: rigidBody.linvel().x, y: rigidBody.linvel().y + moveSpeed * 0.5 }, true);
            }
        }
        else{
            if (engine.input.keyboard.wasPressed(Keys.W)) {
                if(this.grounded || this.airJumps > 0 || Date.now() - this.lastTimeGrounded < 100){
                    rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.max(rigidBody.linvel().y, this.jumpHeight)}, true);
                    if(!(this.grounded || Date.now() - this.lastTimeGrounded < 100)){
                        this.airJumps -= 1
                    }
                }
            }
            if (engine.input.keyboard.wasReleased(Keys.W)){
                rigidBody.setLinvel({ x: rigidBody.linvel().x, y: Math.min(rigidBody.linvel().y, rigidBody.linvel().y * 0.25) }, true);
            }
        }

        if (engine.input.keyboard.wasPressed(Keys.E) && NetworkUtils.getLocalUpgrade("Reversenizer")){
            rigidBody.setLinvel({ x: rigidBody.linvel().x * -0.75, y: rigidBody.linvel().y * -0.75 }, true);
        }

        //dash
        if(engine.input.keyboard.wasPressed(Keys.Q) && this.canDash){
            let dashSpeed = 100
            let direction = new Vector2({x:this.pos.x - engine.input.pointers.primary.lastWorldPos.x, y:this.pos.y - engine.input.pointers.primary.lastWorldPos.y}).normalized().scale(dashSpeed)
            rigidBody.setLinvel({x: rigidBody.linvel().x - (direction.x * 3), y: rigidBody.linvel().y + direction.y}, true)
            this.canDash = false
        }
        let damping: number
        if(this.grappling){
            damping = 0.975
            rigidBody.setLinvel({x: rigidBody.linvel().x * damping, y: Math.min(rigidBody.linvel().y * damping, rigidBody.linvel().y)}, true)
        }
        else{
            //rigidBody.setLinvel({x: MathUtils.clamp(rigidBody.linvel().x, -80, 80), y: rigidBody.linvel().y}, true)
            if(this.grounded){
                if(!(engine.input.keyboard.isHeld(Keys.A) || engine.input.keyboard.isHeld(Keys.D))){
                    damping = 0.9
                }
                else{
                    damping = 0.95
                }
            }
            else{
                damping = 0.995
            }
            rigidBody.setLinvel({x: rigidBody.linvel().x * damping, y: rigidBody.linvel().y}, true)
        }

        if(this.grappling){
            let linvel = new Vector2(rigidBody.linvel())
            if(linvel.magnitude() > this.maxGrappleSpeed){
                rigidBody.setLinvel(linvel.scale((this.maxGrappleSpeed / 2 / linvel.magnitude()) + 0.5), true) // half max speed damping
            }
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
            if (engine.input.keyboard.wasPressed(Keys.Space) && this.timeLastGrappled + this.grappleCooldown * 1000 <= Date.now()) {


                //console.log("Collider", hit.collider, "hit at point", hitPoint); 
                if (!this.joint.isValid()) {

                    let newJoint = generateRevoluteJoint(hit.collider.parent(), rigidBody, hit_point)

                    if (newJoint != undefined) {
                        this.joint = newJoint
                        let endPoint = MathUtils.rapierToExc(hit_point);
                        this.line = CreateGrappleLine(this, new Vector(endPoint.x,endPoint.y))
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
            this.timeLastGrappled = Date.now()
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
            Networking.client.room?.send(C2SPacket.Reload, {})
        }


        if (MouseInput.mouseButtons.left) {
            if (Guns.get(NetworkUtils.getLocalState().gun.gunID).automatic) {
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI, homeRadius: 300, homeStrength: 0.01 })
            } else if (this.shooting == false) {
                let angle = Math.atan2(this.pos.y - engine.input.pointers.primary.lastWorldPos.y, this.pos.x - engine.input.pointers.primary.lastWorldPos.x);
                Networking.client.room?.send(C2SPacket.Shoot, { angle: angle - Math.PI, homeRadius: 300, homeStrength: 0.01  })
                this.shooting = true;
            }
        }else{
            this.shooting = false;
        }


        this.healthBarEntity.get(GraphicsComponent).current.scale.x = NetworkUtils.getLocalState().health / 100


        Networking.client.room?.send(C2SPacket.Move, { x: this.pos.x, y: this.pos.y, rotation: this.rotation })
        super.update(engine, delta);
    }

    

}