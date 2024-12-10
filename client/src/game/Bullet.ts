import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, PhysicsWorld, Rectangle, System, SystemType, TransformComponent, Util, Vector } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Game } from "../world/Game";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType, Ball, ColliderDesc } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint } from "../util"

export class Bullet extends Actor {
    position: Vector
    targetPosition: Vector
    velocity: number
    shape: Ball
    angle: number
    constructor(position: Vector, targetPosititon: Vector, velocity: number){
        super({ x: position.x * 10, y: position.y * 10, radius: 10, color: new Color(128, 22, 55), anchor:Vector.Half });

        this.position = position
        this.targetPosition = targetPosititon
        this.velocity = velocity

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)
        this.shape = new Ball(1)
        this.angle = Math.atan2(targetPosititon.y - position.y, targetPosititon.x - position.x)
    }

    public update(engine: Engine, delta: number){
        let rb = this.get(RigidBodyComponent).body;
        
        rb.setLinvel({ x: Math.cos(this.angle) * this.velocity, y: rb.linvel().y }, true);
        rb.setLinvel({ x: rb.linvel().x, y: Math.sin(this.angle) * this.velocity }, true);

        let hit = PhysicsSystem.physicsWorld.castShape(this.position, this.angle, this.targetPosition, this.shape, 0.0, 100000, false)

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