import { Actor, Canvas, Color, Debug, Entity, GraphicsComponent, Scene, TransformComponent, Vector, Rectangle, Graphic, vec } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity, OtherPlayerComponent, OtherPlayerMoveSystem } from "../game/Entities/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier2d-compat";
import { createTransformComponent, Vector2 } from "../util";
import { Networking } from "../networking/Networking";
import { NetworkClient } from "../networking/NetworkClient";
import { BulletMoveSystem, createBullet } from "../game/Entities/Bullet";
import { S2CPackets } from "shared/src/networking/Packet";
import { CreateGrappleLine, GrappleLineSystem } from "../game/Entities/GrappleLine";
import { debug } from "console";

//export var PlayerEntities: Entity<any>[] = [];
export var PlayerEntities: Map<String, Entity<OtherPlayerComponent>> = new Map();

export class Game extends Scene {

    private playButton: Actor | undefined;



    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsSystemDebug);
        this.world.systemManager.addSystem(GrappleLineSystem)
        this.world.systemManager.addSystem(OtherPlayerMoveSystem);
        this.world.systemManager.addSystem(BulletMoveSystem);



        let localPlayer = new LocalPlayer(0, 300);
        engine.add(localPlayer)


        engine.add(this.createGroundRect(0, 0, 100, 2, new Color(50, 50, 50)))

        Networking.client.room!.state.players.onAdd((player: any, id: string) => {
            if (Networking.client.clientId != id) {
                let ent = createOtherPlayerEntity(player.name, id, new Vector(0, -60));
                PlayerEntities.set(id, ent)
                this.add(ent)



                player.listen("grappling", (value: boolean, previousValue: boolean) => {
                    let me = PlayerEntities.get(id)!;
                    let playerData = me.get(OtherPlayerComponent);

                    if (value) {
                        let grapple = CreateGrappleLine(me, Vector2.new(player.grappleX,player.grappleY))
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

        Networking.client.room!.state.bullets.onAdd((bullet: any, id: string) => {
            let bulletEntity = createBullet(bullet.angle, vec(bullet.position.x, bullet.position.y),id,"a")
            this.add(bulletEntity)
        })

        /*
        Networking.client.room!.onMessage(S2CPackets.BulletSpawn, (message) => {
            let bullet = createBullet("a", message.angle, vec(message.position.x, message.position.y))
            this.add(bullet)
        })*/


        this.playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Orange,
            pos: new Vector(-400, -400),
            anchor: Vector.Half
        })

        this.camera.pos = Vector.Zero

        this.playButton.on("pointerdown", function () {
            Networking.client.room?.leave();
            engine.goToScene("mainMenu");
        })

        this.add(this.playButton)
        //this.add(createOtherPlayerEntity("test", vec(0, -20)))


    }

    public createGroundRect(x: number, y: number, width: number, height: number, color: Color): Entity {
        let colliderDesc = ColliderDesc.cuboid(width, height).setCollisionGroups(0x00010007)
        let floor = new Entity()
            .addComponent(createTransformComponent(new Vector(x, y)))
            .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
            .addComponent(new ColliderComponent(colliderDesc))

        let sprite = new Rectangle({ width: width * 20, height: height * 20, color: color })
        let graphics = new GraphicsComponent();
        graphics.add(sprite);

        floor.addComponent(graphics)

        return floor
    }

}
