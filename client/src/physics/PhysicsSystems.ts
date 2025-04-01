import { Color, Debug, FrameStats, Query, System, SystemType, TransformComponent, Vector, World } from "excalibur";
import RAPIER, { IntegrationParameters, RigidBody, RigidBodyDesc, Vector2 } from '@dimforge/rapier2d-compat';
import { ColliderComponent, RigidBodyComponent } from "./PhysicsComponents";
import { Network } from "inspector/promises";
import { Networking } from "../networking/Networking";
import { lerp } from "../util";
import { engine } from "..";
import { Game, LocalPlayerInstance } from "../scenes/Game";

export class PhysicsSystem extends System {
    public systemType = SystemType.Update;

    private static gravity = { x: 0.0, y: -130 };
    public static physicsWorld: RAPIER.World;

    public static lastTickms = 0;

    rigidBodyQuery: Query<typeof RigidBodyComponent | typeof TransformComponent>;
    coliderQuery: Query<typeof ColliderComponent | typeof TransformComponent>;

    constructor(world: World) {
        super();
        // this.query = world.query([RigidBodyComponent, ColliderComponent, TransformComponent]);
        PhysicsSystem.physicsWorld = new RAPIER.World(PhysicsSystem.gravity);
        PhysicsSystem.physicsWorld.integrationParameters.lengthUnit = 10;
        PhysicsSystem.physicsWorld.integrationParameters.maxCcdSubsteps=4
        PhysicsSystem.physicsWorld.timestep = 1/120

        this.rigidBodyQuery = world.query([RigidBodyComponent, TransformComponent]);

        this.rigidBodyQuery.entityAdded$.subscribe(entity => {
            const rigidBody = entity.get(RigidBodyComponent);
            let description = new RigidBodyDesc(rigidBody.rigidBodyType);
            description.setCcdEnabled(true)
            let pos = entity.get(TransformComponent).pos

            description.setTranslation(pos.x / 10, -(pos.y / 10))
            rigidBody.body = PhysicsSystem.physicsWorld.createRigidBody(description);

            console.log(description.translation)

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

            entity.on("kill", function (entity) {
                let collider = entity.target.get(ColliderComponent)
                if (!collider.killed) {
                    collider.killed = true
                    PhysicsSystem.physicsWorld.removeCollider(collider.collider, false)
                }
            })
        })
    }


    update(elapsedMs: number): void {
        PhysicsSystem.physicsWorld.step();
        PhysicsSystem.lastTickms = Date.now()
    }

}

export class PhysicsObjectRenderSystem extends System {
    public systemType = SystemType.Draw;
    rigidBodyQuery: Query<typeof RigidBodyComponent | typeof TransformComponent>;

    constructor(world: World) {
        super();
        this.rigidBodyQuery = world.query([RigidBodyComponent, TransformComponent]);
    }

    update(elapsedMs: number): void {
        for (let entity of this.rigidBodyQuery.entities) {
            if (entity.isKilled()) {
                continue
            }

            //console.log(entity.name)
            const transform = entity.get(TransformComponent);
            const body = entity.get(RigidBodyComponent).body;

            let bodyPosition = body.translation()

            /*
            if (body.isMoving()) {
                let bodyVelocity = body.linvel();
                //transform.pos.x = lerp(transform.pos.x, bodyPosition.x * 10 + bodyVelocity.x/3, (elapsedMs / 1000) * 16.6)
                //transform.pos.y = lerp(transform.pos.y, -bodyPosition.y * 10 - bodyVelocity.y/3, (elapsedMs / 1000) * 16.6)

                let elapsedMs = Math.max(Date.now() - PhysicsSystem.lastTickms,1)

                transform.pos.x = (bodyPosition.x * 10) + bodyVelocity.x * elapsedMs/1000
                transform.pos.y = (-bodyPosition.y * 10) - bodyVelocity.y* elapsedMs/1000
            } else {
                transform.pos.x = bodyPosition.x * 10
                transform.pos.y = -bodyPosition.y * 10
            }*/
            transform.pos.x = bodyPosition.x * 10
            transform.pos.y = -bodyPosition.y * 10
            transform.rotation = -body.rotation();

            if(entity.name == "localplayer"){
                
                engine.currentScene.camera.pos = new Vector(transform.pos.x,transform.pos.y)

                engine.currentScene.camera.pos.clampMagnitude(1000)
            }

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