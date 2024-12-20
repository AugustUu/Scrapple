import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { RigidBody, RigidBodyDesc, Collider, ColliderDesc } from '@dimforge/rapier2d-compat';
import { World } from "./World";


export class KinematicPhysicsObject {
    sprite: Graphics;
    rigidBody: RigidBody;
    collider: Collider;
    window_offset: { x: number, y: number };
    //for circle
    constructor(x: number, y: number, radius: number, world: World, sprite: Graphics) {
        this.sprite = sprite
        this.rigidBody = World.world.createRigidBody(RigidBodyDesc.dynamic().setTranslation(x, y));

        this.collider = World.world.createCollider(ColliderDesc.ball(radius), this.rigidBody);
        
        //group 2 (0100)and interacts with 0, 1, 2 (0111)
        this.collider.setCollisionGroups(0x00040007)

        this.window_offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        this.sprite = sprite;
        app.stage.addChild(sprite);
        app.ticker.add(delta => this.spriteUpdate(delta));
    }
    spriteUpdate(delta: Ticker) {
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * -10 + this.window_offset.y;
    }
}

export class StaticPhysicsObject {
    sprite: Graphics
    rigidBody: RigidBody;
    collider: Collider;
    window_offset: { x: number, y: number };
    //for cuboid
    constructor(x: number, y: number, halfwidth: number, halfheight: number, world: World, sprite: Graphics) {

        this.rigidBody = World.world.createRigidBody(RigidBodyDesc.fixed());

        this.collider = World.world.createCollider(ColliderDesc.cuboid(halfwidth, halfheight), this.rigidBody);
        //part of group 0001 (0), interacts with 0 & 1 & 2(0111)
        this.collider.setCollisionGroups(0x00010007)
        this.rigidBody.setTranslation({ x, y }, true)

        this.window_offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        this.sprite = sprite;
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * -10 + this.window_offset.y;
        this.sprite.pivot.x = sprite.width / 2
        this.sprite.pivot.y = sprite.height / 2
        app.stage.addChild(sprite);
    }
}

export class KinPosPhysicsObject {
    sprite: Graphics
    rigidBody: RigidBody;
    collider: Collider;
    window_offset: { x: number, y: number };
    //for cuboid
    constructor(x: number, y: number, halfwidth: number, halfheight: number, world: World, sprite: Graphics) {

        this.rigidBody = World.world.createRigidBody(RigidBodyDesc.kinematicPositionBased());

        this.collider = World.world.createCollider(ColliderDesc.cuboid(halfwidth, halfheight), this.rigidBody);
        this.rigidBody.setTranslation({ x, y }, true)

        this.window_offset = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
        this.sprite = sprite;
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * -10 + this.window_offset.y;
        this.sprite.pivot.x = sprite.width / 2
        this.sprite.pivot.y = sprite.height / 2
        app.stage.addChild(sprite);
        app.ticker.add(delta => this.spriteUpdate(delta));
    }
    spriteUpdate(delta: Ticker) {
        this.sprite.x = this.rigidBody.translation().x * 10 + this.window_offset.x;
        this.sprite.y = this.rigidBody.translation().y * -10 + this.window_offset.y;
    }
}