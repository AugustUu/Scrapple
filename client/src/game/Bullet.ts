import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { Ball, RigidBody, RigidBodyDesc, Vector2 } from "@dimforge/rapier2d-compat";
import { World } from "../physics/World";
import { start } from "repl";
import { InputSystem } from "../util/InputSystem";

export class bullet {
    sprite: Graphics
    rb: RigidBody
    shape: Ball
    position: Vector2
    targetPosition: Vector2
    rotation: number
    window_offset: { x: number, y: number };
    velocity: number;

    constructor(position: Vector2, targetPosititon: Vector2, velocity: number){
        this.rb = World.world.createRigidBody(RigidBodyDesc.dynamic().setTranslation(position.x, position.y));
        this.shape = new Ball(1);
        this.sprite = new Graphics().circle(position.x, position.y, 10).fill(0xddaa03);
        this.position = position;
        this.targetPosition = targetPosititon
        this.rotation = this.rb.rotation()
        this.velocity = velocity;
        this.window_offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

        app.stage.addChild(this.sprite);
        app.ticker.add(delta => this.spriteUpdate(delta))
    }

    spriteUpdate(delta: Ticker){
        this.sprite.x = this.rb.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rb.translation().y * -10 + this.window_offset.y;
                //check if it hits someting!!!
        if(World.world.intersectionWithShape(this.position, this.rotation, this.shape) == null){
            //hit nothing
        }
        else{
            World.world.intersectionsWithShape(this.position, this.rotation, this.shape, (handle) => {
                //what to do if it hits something
                console.log("The collider", handle, "intersects our shape.");
                return true;
            })
        }

    }
}