import { Actor, Canvas, Color, Debug, Entity, GraphicsComponent, Scene, TransformComponent, Vector, Rectangle, Graphic, vec } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity, OtherPlayerComponent } from "../game/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { ColliderDesc, RigidBodyDesc, RigidBodyType, Vector2 } from "@dimforge/rapier2d-compat";
import { createTransformComponent } from "../util";
import { Networking } from "../networking/Networking";
import { NetworkClient } from "../networking/NetworkClient";
import { CreateGrappleLine, GrappleLineComponent, GrappleLineSystem } from "../game/GrappleLine";

export class Game extends Scene {

    private playButton: Actor | undefined;



    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsSystemDebug);
        this.world.systemManager.addSystem(GrappleLineSystem)

        let localPlayer = new LocalPlayer(0, 300);
        engine.add(localPlayer)

        engine.add(this.createGroundRect(0, 0, 100, 2, new Color(50, 50, 50)))

        Networking.client.room!.state.players.onAdd((player: any, id: string) => {
            if(Networking.client.clientId != id){
                let ent = createOtherPlayerEntity(player.name, new Vector(0, -60));
                this.add(ent)

                player.listen("x", (value:number, previousValue:number) => {
                    ent.get(TransformComponent).pos.x = value
                })

                player.listen("y", (value:number, previousValue:number) => {
                    ent.get(TransformComponent).pos.y = value
                })
            }
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
        this.add(createOtherPlayerEntity("test",vec(0,-20)))

        this.add(CreateGrappleLine())


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
