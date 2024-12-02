import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, PhysicsWorld, Rectangle, System, SystemType, TransformComponent, Util, Vector } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Level } from "../world/Level";
import RAPIER, { RigidBody, JointData, ImpulseJoint, Ray, Collider, RigidBodyType, Ball } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "../physics/PhysicsSystems";
import { Vector2, MathUtils, generateRevoluteJoint as generateRevoluteJoint } from "../util"

export class Bullet extends Actor {
    shape: Ball
    position: Vector

    constructor(position: Vector, targetPosititon: Vector, velocity: number){
        super({ x: position.x * 10, y: position.y * 10, radius: 20, color: new Color(128, 22, 55), anchor:Vector.Half });
        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)
        this.shape = new Ball(2)
        this.position = position
    }

    public update(engine: Engine, delta: number){
        let rb = this.get(RigidBodyComponent).body;

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