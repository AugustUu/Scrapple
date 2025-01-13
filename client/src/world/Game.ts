import { Actor, Canvas, Color, Debug, Entity, GraphicsComponent, Scene, TransformComponent, Vector, Rectangle, Graphic, vec, Circle, Polygon, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity, OtherPlayerComponent, OtherPlayerMoveSystem } from "../game/Entities/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Ball, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier2d-compat";
import { createTransformComponent, Vector2 } from "../util";
import { Networking } from "../networking/Networking";
import { BulletComponent, BulletMoveSystem, createBullet } from "../game/Entities/Bullet";
import { CreateGrappleLine, GrappleLineSystem } from "../game/Entities/GrappleLine";
import { Bullet } from "server/src/State";

export var PlayerEntities: Map<String, Entity<OtherPlayerComponent>> = new Map();
export var BulletEntities: Map<String, Entity<BulletComponent>> = new Map();
export var LocalPlayerInstance: LocalPlayer;

export class Game extends Scene {

    private playButton: Actor | undefined;




    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsSystemDebug);
        this.world.systemManager.addSystem(GrappleLineSystem)
        this.world.systemManager.addSystem(OtherPlayerMoveSystem);
        this.world.systemManager.addSystem(BulletMoveSystem);


        this.camera.pos = Vector.Zero

       


    }

    onActivate(context: SceneActivationContext<unknown>): void {

        LocalPlayerInstance = new LocalPlayer(0, 300);
        this.add(LocalPlayerInstance)



        engine.add(this.createGroundShape(0, 0, new Color(50, 50, 50), 100, 2))
        engine.add(this.createGroundShape(20, 150, new Color(20, 20, 20), undefined, undefined, 5))
        engine.add(this.createGroundShape(0, 0, new Color(90, 0, 10), undefined, undefined, undefined, new Vector(-40, 2), new Vector(-20, 2), new Vector(-40, 20)))


        Networking.client.room!.state.players.onAdd((player: any, id: string) => {
            if (Networking.client.clientId != id) {
                let ent = createOtherPlayerEntity(player.name, id, new Vector(0, -60));
                PlayerEntities.set(id, ent)
                this.add(ent)



                player.listen("grappling", (value: boolean, previousValue: boolean) => {
                    let me = PlayerEntities.get(id)!;
                    let playerData = me.get(OtherPlayerComponent);

                    if (value) {
                        let grapple = CreateGrappleLine(me, Vector2.new(player.grappleX, player.grappleY))
                        this.add(grapple);
                        playerData.grappleLine = grapple;
                    } else {
                        playerData.grappleLine?.kill()

                    }
                })

            }
        })

        Networking.client.room!.state.players.onRemove((player: any, id: string) => {
            PlayerEntities.get(id)?.kill()
        })

        Networking.client.room!.state.bullets.onAdd((bullet: Bullet, id: string) => {
            let bulletEntity = createBullet(bullet.angle, vec(bullet.position.x, bullet.position.y), id, bullet.shotById)
            BulletEntities.set(id, bulletEntity)
            this.add(bulletEntity)
        })

        Networking.client.room!.state.bullets.onRemove((bullet: any, id: string) => {
            BulletEntities.get(id)?.kill()
        })

        this.playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Orange,
            pos: new Vector(-400, -400),
            anchor: Vector.Half
        })

        this.playButton.on("pointerdown", function () {
            Networking.client.room?.leave();
            engine.goToScene("mainMenu");
        })

        this.add(this.playButton)
        //this.add(createOtherPlayerEntity("test", vec(0, -20)))


    }

    public createGroundShape(x: number, y: number, color: Color, width?: number, height?: number, radius?: number, vector1?: Vector, vector2?: Vector, vector3?: Vector): Entity {
        let sprite: Graphic
        let floor = new Entity
        if (width != undefined && height != undefined) {
            let colliderDesc = ColliderDesc.cuboid(width, height).setCollisionGroups(0x00010007)
            floor
                .addComponent(createTransformComponent(new Vector(x, y)))
                .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
                .addComponent(new ColliderComponent(colliderDesc))

            sprite = new Rectangle({ width: width * 20, height: height * 20, color: color })

            let graphics = new GraphicsComponent();
            graphics.add(sprite);

            floor.addComponent(graphics)

        }
        if (radius != undefined) {
            let colliderDesc = ColliderDesc.ball(radius).setCollisionGroups(0x00010007)
            floor
                .addComponent(createTransformComponent(new Vector(x, y)))
                .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
                .addComponent(new ColliderComponent(colliderDesc))
    
            sprite = new Circle({ radius: radius * 10, color: color })

            let graphics = new GraphicsComponent();
            graphics.add(sprite);
    
            floor.addComponent(graphics)

        }

        if(vector1 != undefined && vector2 != undefined && vector3 != undefined){
            let colliderDesc = ColliderDesc.triangle(vector1, vector2, vector3).setCollisionGroups(0x00010007)
            floor
                .addComponent(createTransformComponent(new Vector(x, y)))
                .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
                .addComponent(new ColliderComponent(colliderDesc))
    
            //sprite = new Polygon({ points: vector1, color: color })

            let graphics = new GraphicsComponent();
            graphics.add(sprite);

            floor.addComponent(graphics)

        }

        return floor

        

    }

}
