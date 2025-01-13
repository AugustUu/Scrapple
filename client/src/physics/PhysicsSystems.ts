import { Color, Debug, Query, System, SystemType, TransformComponent, Vector, World } from "excalibur";
import RAPIER, { RigidBody, RigidBodyDesc, Vector2 } from '@dimforge/rapier2d-compat';
import { ColliderComponent, RigidBodyComponent } from "./PhysicsComponents";
import { Network } from "inspector/promises";
import { Networking } from "../networking/Networking";

export class PhysicsSystem extends System {
    public systemType = SystemType.Update;

    private static gravity = { x: 0.0, y: -98 };
    public static physicsWorld: RAPIER.World;

    rigidBodyQuery: Query<typeof RigidBodyComponent | typeof TransformComponent>;
    coliderQuery: Query<typeof ColliderComponent | typeof TransformComponent>;

    constructor(world: World) {
        super();
        // this.query = world.query([RigidBodyComponent, ColliderComponent, TransformComponent]);
        PhysicsSystem.physicsWorld = new RAPIER.World(PhysicsSystem.gravity);
        PhysicsSystem.physicsWorld.lengthUnit = 10;

        this.rigidBodyQuery = world.query([RigidBodyComponent, TransformComponent]);

        this.rigidBodyQuery.entityAdded$.subscribe(entity => {
            const rigidBody = entity.get(RigidBodyComponent);
            let description = new RigidBodyDesc(rigidBody.rigidBodyType);
            description.setCcdEnabled(true)
            let pos = entity.get(TransformComponent).pos
            description.translation = new Vector2(pos.x / 10, pos.y / 10);

            rigidBody.body = PhysicsSystem.physicsWorld.createRigidBody(description);

            entity.on("kill", function (deadEntity) {
                let rigidBody = deadEntity.target.get(RigidBodyComponent)
                if (!rigidBody.killed) {
                    rigidBody.killed = true
                    PhysicsSystem.physicsWorld.removeRigidBody(rigidBody.body)
                }
            })
        })

        this.coliderQuery = world.query([ColliderComponent, TransformComponent]);
        this.coliderQuery.entityAdded$.subscribe(entity => {
            const collider = entity.get(ColliderComponent);
            const rigidBody = entity.get(RigidBodyComponent);



            if (rigidBody) {
                collider.collider = PhysicsSystem.physicsWorld.createCollider(collider.colliderDesc, rigidBody.body);
            } else {
                collider.colliderDesc.translation = entity.get(TransformComponent).pos
                collider.collider = PhysicsSystem.physicsWorld.createCollider(collider.colliderDesc);
            }
            
            entity.on("kill",function(entity){
                let collider = entity.target.get(ColliderComponent)
                if(!collider.killed){
                    collider.killed = true
                    PhysicsSystem.physicsWorld.removeCollider(collider.collider,false)
                }
            })
        })
    }


    update(elapsedMs: number): void {
        PhysicsSystem.physicsWorld.step();


        for (let entity of this.rigidBodyQuery.entities) {
            if(entity.isKilled()){
                continue
            }
            const transform = entity.get(TransformComponent);
            const body = entity.get(RigidBodyComponent);

            let pos = body.body.translation()
            transform.pos.setTo(pos.x * 10, -pos.y * 10);
            transform.rotation = -body.body.rotation();
        }
    }

}

export class PhysicsSystemDebug extends System {
    public systemType = SystemType.Draw;

    update(elapsedMs: number): void {
        const { vertices, colors } = PhysicsSystem.physicsWorld.debugRender();
        for (let i = 0; i < vertices.length / 4; i += 1) {
            Debug.drawLine(new Vector(vertices[i * 4] * 10, -vertices[i * 4 + 1] * 10), new Vector(vertices[i * 4 + 2] * 10, -vertices[i * 4 + 3] * 10), { color: Color.Red })
        }
    }

}