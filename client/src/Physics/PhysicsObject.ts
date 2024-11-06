import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { World as World } from './world';
import RAPIER, { RigidBody } from '@dimforge/rapier2d-compat';


export class KinematicPhysicsObject {
    sprite: Graphics;
    rigidBody: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    window_offset: {x:number, y:number};
    //for circle
    constructor(x: number, y: number, radius: number, world: World, sprite: Graphics){
        this.sprite = sprite
        this.rigidBody = World.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y));

        this.collider = World.world.createCollider(RAPIER.ColliderDesc.ball(radius), this.rigidBody);

        this.window_offset = {x:window.innerWidth / 2, y:window.innerHeight / 2}
        this.sprite = sprite;
        app.stage.addChild(sprite);
        app.ticker.add(delta => this.gameLoop(delta))
    }
    gameLoop(delta: Ticker){
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * -10 + this.window_offset.y;
    }
}

export class StaticPhysicsObject{
    sprite: Graphics
    rigidBody: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    window_offset: {x:number, y:number};
    //for cuboid
    constructor(x: number, y: number, halfwidth: number, halfheight: number, world: World, sprite: Graphics){

        this.rigidBody = World.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y));
        
        this.collider = World.world.createCollider(RAPIER.ColliderDesc.cuboid(halfwidth, halfheight));

        this.window_offset = {x:window.innerWidth / 2, y:window.innerHeight / 2}
        this.sprite = sprite;
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * 10 + this.window_offset.y;
        this.sprite.pivot.x = sprite.width / 2
        this.sprite.pivot.y = sprite.height / 2
        app.stage.addChild(sprite);
    }
}