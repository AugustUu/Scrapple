import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { Ball, RigidBody, RigidBodyDesc, Vector2 } from "@dimforge/rapier2d-compat";
import { World } from "../physics/World";
import { start } from "repl";

export class bullet {
    sprite: Graphics
    rb: RigidBody
    shape: Ball
    position: Vector2
    rotation: number
    window_offset: { x: number, y: number };

    constructor(startPos: Vector2, velocity: number){
        this.rb = World.world.createRigidBody(RigidBodyDesc.dynamic().setTranslation(startPos.x, startPos.y));
        this.shape = new Ball(1);
        this.sprite = new Graphics().circle(startPos.x, startPos.y, 10).fill(0xddaa03);
        this.position = startPos;
        this.rotation = this.rb.rotation()
        this.window_offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

        app.stage.addChild(this.sprite);
        app.ticker.add(delta => this.bulletUpdate(delta))
    }

    bulletUpdate(delta: Ticker){
        this.sprite.x = this.rb.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rb.translation().y * -10 + this.window_offset.y;

        if(World.world.intersectionWithShape(this.position, this.rotation, this.shape) != null){
            console.log("hit something!");
        }
    }
}