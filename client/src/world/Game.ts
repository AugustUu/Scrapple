import { Actor, Canvas, Color, Debug, Entity, GraphicsComponent, Scene, TransformComponent, Vector, Rectangle, Graphic, vec, Circle } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity, OtherPlayerComponent, OtherPlayerMoveSystem } from "../game/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { Ball, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier2d-compat";
import { createTransformComponent, Vector2 } from "../util";
import { Networking } from "../networking/Networking";
import { NetworkClient } from "../networking/NetworkClient";
import { BulletMoveSystem, createBullet } from "../game/Bullet";
import { S2CPackets } from "shared/src/networking/Packet";
import { CreateGrappleLine, GrappleLineSystem } from "../game/GrappleLine";
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


        engine.add(this.createGroundRect(0, 0, new Color(50, 50, 50), 100, 2))

        Networking.client.room!.state.players.onAdd((player: any, id: string) => {
            if (Networking.client.clientId != id) {
                let ent = createOtherPlayerEntity(player.name, id, new Vector(0, -60));
                PlayerEntities.set(id, ent)
                this.add(ent)



                player.listen("grappling", (value: boolean, previousValue: boolean) => {
                    if (value) {
                        //debugger
                        let me = PlayerEntities.get(id)!;
                        let grapple = CreateGrappleLine(me, Vector2.new(player.grappleX,player.grappleY))
                        this.add(grapple);
                        me.get(OtherPlayerComponent).grappleLine = grapple;
                    } else {
                        let me = PlayerEntities.get(id)!;
                        me.get(OtherPlayerComponent).grappleLine.kill()
                    }
                })

            }
        })
        Networking.client.room!.state.players.onRemove((player: any, id: string) => {
            PlayerEntities.get(id)?.kill()
        })


        Networking.client.room!.onMessage(S2CPackets.BulletSpawn, (message) => {
            let bullet = createBullet("a", message.angle, vec(message.position.x, message.position.y))
            this.add(bullet)
        })


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

    public createGroundRect(x: number, y: number, color: Color, width?: number, height?: number, radius?: number): Entity {
        let sprite: Graphic
        let floor: Entity()
        if(width != undefined && height != undefined){
            let colliderDesc = ColliderDesc.cuboid(width, height).setCollisionGroups(0x00010007)
            let floor = new Entity()
                .addComponent(createTransformComponent(new Vector(x, y)))
                .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
                .addComponent(new ColliderComponent(colliderDesc))
    
            sprite = new Rectangle({ width: width * 20, height: height * 20, color: color })

            let graphics = new GraphicsComponent();
            graphics.add(sprite);
    
            floor.addComponent(graphics)
    
            return floor
        }
        if(radius != undefined){
            let colliderDesc = ColliderDesc.ball(radius).setCollisionGroups(0x00010007)
            let floor = new Entity()
                .addComponent(createTransformComponent(new Vector(x, y)))
                .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
                .addComponent(new ColliderComponent(colliderDesc))
    
            sprite = new Circle({ radius: radius * 20, color: color })

            let graphics = new GraphicsComponent();
            graphics.add(sprite);
    
            floor.addComponent(graphics)
    
            return floor
        }

        return floor
    }

}
