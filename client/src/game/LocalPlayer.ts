import { Actor, Color, Component, CoordPlane, Engine, Entity, GraphicsComponent, Input, Keys, Rectangle, System, SystemType, TransformComponent, Vector } from "excalibur";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import RAPIER, { RigidBody, RigidBodyType, Vector2 } from '@dimforge/rapier2d-compat';

export class LocalPlayer extends Actor {
    public health: number = 100;

    constructor(x: number, y: number,) {
        super({ x: x, y: y, width: 100, height: 100, color: Color.Green, anchor:Vector.Half });

        let rigidBody = new RigidBodyComponent(RigidBodyType.Dynamic);
        this.addComponent(rigidBody)

        this.addComponent(new ColliderComponent(RAPIER.ColliderDesc.cuboid(5, 5), rigidBody.body))

    }

    public update(engine: Engine, delta: number) {

        
        let rigidBody = this.get(RigidBodyComponent).body;

        if (engine.input.keyboard.isHeld(Keys.W)) {
            rigidBody.setLinvel(new Vector2(0,10),true)
        }
        if (engine.input.keyboard.isHeld(Keys.A)) {
            rigidBody.setLinvel(new Vector2(-10,0),true)
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            rigidBody.setLinvel(new Vector2(0,-10),true)
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            rigidBody.setLinvel(new Vector2(10,0),true)
        }

        super.update(engine, delta);
    }
}