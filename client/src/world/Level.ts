import { Actor, Canvas, Color, Debug, Entity, Scene, TransformComponent, Vector } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity } from "../game/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { ColliderComponent, RigidBodyComponent } from "../physics/PhysicsComponents";
import { ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier2d-compat";
import { createTransformComponent, Vector2 } from "../util";
import { Bullet } from "../game/Bullet";

export class Level extends Scene {

    private playButton: Actor | undefined;


    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsSystemDebug);

        let localPlayer = new LocalPlayer(20,300);
        engine.add(localPlayer)

        let bullet = new Bullet(new Vector(-20, 10), new Vector(20, 20), 5)
        engine.add(bullet)
        
        let colliderDesc = ColliderDesc.cuboid(100, 2).setCollisionGroups(0x00010007)
        let floor = new Entity()
        .addComponent(createTransformComponent(Vector.Zero))
        .addComponent(new RigidBodyComponent(RigidBodyType.KinematicPositionBased))
        .addComponent(new ColliderComponent(colliderDesc))

        this.add(floor)




        this.playButton = new Actor({
            width: 50,
            height: 50,
            color: Color.Orange,
            pos: new Vector(-400, -400),
            anchor: Vector.Half
        })
        
        this.camera.pos = Vector.Zero

        this.playButton.on("pointerdown", function () {
            engine.goToScene("mainMenu");
        })

        this.add(this.playButton)


    }

}
