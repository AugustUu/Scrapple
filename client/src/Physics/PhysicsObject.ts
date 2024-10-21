import { Application, Graphics, PointData, Ticker } from "pixi.js";
import { app } from "..";
import { World as World } from './world';
import RAPIER, { RigidBody } from '@dimforge/rapier2d-compat';


export class KinematicPhysicsObject {
    sprite: Graphics;
    rigidBody: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    //for cuboid
    constructor(x: number, y: number, halfwidth: number, halfheight: number, world: World, sprite: Graphics){
        this.rigidBody = World.world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y));

        this.collider = World.world.createCollider(RAPIER.ColliderDesc.cuboid(halfwidth, halfwidth), this.rigidBody);

        this.sprite = sprite;
    }
}

export class StaticPhysicsObject{
    sprite: Graphics;
    rigidBody: RAPIER.RigidBody;
    collider: RAPIER.Collider;
    //for cuboid
    constructor(x: number, y: number, halfwidth: number, halfheight: number, world: World, sprite: Graphics){
        this.rigidBody = World.world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(x, y));
        
        this.collider = World.world.createCollider(RAPIER.ColliderDesc.cuboid(halfwidth, halfheight));

        this.sprite = new Graphics();
    }
}

/*
let groundColliderDesc = RAPIER.ColliderDesc.cuboid(10.0, 1);
World.world.createCollider(groundColliderDesc);

let rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 10.0);
let rigidBody = World.world.createRigidBody(rigidBodyDesc);

let colliderDesc = RAPIER.ColliderDesc.cuboid(1, 1);
let collider = World.world.createCollider(colliderDesc, rigidBody);

let rigidBodySprite = new Graphics().rect(100, 0, 100, 100).fill(0xff0000);
let groundSprite = new Graphics().rect(0, 500, 1000, 100).fill(0x0000ff);
*/