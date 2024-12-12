import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, PhysicsWorld, Rectangle, System, SystemType, TransformComponent, Util, Vector } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Game } from "../world/Game";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType, Ball, ColliderDesc } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint } from "../util"

export class Bullet extends Actor {
    position: Vector2
    targetPosition: Vector2
    velocity: number
    shape: Ball
    angle: number
    constructor(position: Vector2, targetPosititon: Vector2, velocity: number){
        super({ x: position.x, y: position.y * -1, radius: 10, color: new Color(128, 22, 55), anchor:Vector.Half });

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)
        this.position = position
        this.targetPosition = targetPosititon
        this.velocity = velocity

        //update collider groups for this. ugh.
        //this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.ball(1).setCollisionGroups(0x00020007).setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS), rigidBody.body))
        //let col = this.get(ColliderComponent).collider;

        this.shape = new Ball(1)
        this.angle = Math.atan2(targetPosititon.y - position.y, targetPosititon.x - position.x)

        console.log(this.targetPosition)
        console.log("angle is " + this.angle)
    }

    public update(engine: Engine, delta: number){
        let rb = this.get(RigidBodyComponent).body;
        //let col = this.get(ColliderComponent).collider;
        
        rb.setLinvel({ x: this.angle * this.velocity, y: this.angle * this.velocity}, true);


        this.position.x = rb.translation().x
        this.position.y = rb.translation().y



        if(PhysicsSystem.physicsWorld.intersectionWithShape(this.position, this.rotation, this.shape) == null){
            //console.log("tragic")
            //hit nothing

        }
        else{
            PhysicsSystem.physicsWorld.intersectionsWithShape(this.position, this.rotation, this.shape, (handle) => {
                //what to do if it hits something
                console.log("hits")
                //console.log("The collider", handle, "intersects our shape.");
                
                return true;
            })
        }
        super.update(engine, delta);
    }

}