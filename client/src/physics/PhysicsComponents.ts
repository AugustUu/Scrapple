import { Component, Entity } from "excalibur";
import RAPIER, { RigidBody, RigidBodyDesc, RigidBodyType, Vector } from '@dimforge/rapier2d-compat';
import { PhysicsSystem } from "./PhysicsSystems";

export class RigidBodyComponent extends Component {
    body!: RAPIER.RigidBody;
    rigidBodyType: RigidBodyType;
    killed: boolean = false;


    constructor(rigidBodyType: RigidBodyType) {
        super();
        this.rigidBodyType = rigidBodyType;
    }
}


export class ColliderComponent extends Component {
    collider!: RAPIER.Collider;
    colliderDesc: RAPIER.ColliderDesc
    killed: boolean = false;


    constructor(colliderDesc: RAPIER.ColliderDesc, body?: RAPIER.RigidBody) {
        super();
        this.colliderDesc = colliderDesc;
        /*
        if (body) {
            this.collider = PhysicsSystem.physicsWorld.createCollider(colliderDesc, body);
        } else {
            this.collider = PhysicsSystem.physicsWorld.createCollider(colliderDesc);
            
        }*/
    }


}