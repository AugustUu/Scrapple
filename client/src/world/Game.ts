import { Actor, Color, Entity, Scene, Vector, vec, SceneActivationContext } from "excalibur";
import { engine } from "..";
import { createOtherPlayerEntity, OtherPlayerComponent, OtherPlayerMoveSystem } from "../game/Entities/OtherPlayer";
import { LocalPlayer } from "../game/LocalPlayer";
import { PhysicsObjectRenderSystem, PhysicsSystem, PhysicsSystemDebug } from "../physics/PhysicsSystems";
import { createGroundShape } from "../util";
import { Networking } from "../networking/Networking";
import { BulletComponent, BulletMoveSystem, createBullet } from "../game/Entities/Bullet";
import { GrappleLineSystem } from "../game/Entities/GrappleLine";
import { Bullet, CircleCollider, Collider, Player, RectangleCollider } from "server/src/State";

export var PlayerEntities: Map<String, Entity<OtherPlayerComponent>> = new Map();
export var BulletEntities: Map<String, Entity<BulletComponent>> = new Map();
export var LocalPlayerInstance: LocalPlayer;

export class Game extends Scene {

    private playButton: Actor | undefined;
    private hudElement!: HTMLElement;

    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsObjectRenderSystem);
        //this.world.systemManager.addSystem(PhysicsSystemDebug);
        this.world.systemManager.addSystem(GrappleLineSystem)
        this.world.systemManager.addSystem(OtherPlayerMoveSystem);
        this.world.systemManager.addSystem(BulletMoveSystem);


        this.camera.pos = Vector.Zero
        this.camera.zoom = 1

        this.hudElement = document.getElementById('hud')!;


    }

    public onActivate(context: SceneActivationContext<unknown>): void {

        this.hudElement.style.display = "";


        /*
        engine.add(createGroundShape(0, 500, new Color(50, 50, 50), { type: 'Rectangle', height: 5, width: 50 }))

        engine.add(createGroundShape(700, 100, new Color(0, 100, 0), { type: 'Rectangle', height: 5, width: 20 }))
        engine.add(createGroundShape(-700, 100, new Color(0, 100, 0), { type: 'Rectangle', height: 5, width: 20 }))
        engine.add(createGroundShape(-200, -300, new Color(20, 20, 20), { type: 'Circle', radius: 5 }))
        engine.add(createGroundShape(200, -300, new Color(20, 20, 20), { type: 'Circle', radius: 5 }))

        engine.add(createGroundShape(0, 300, new Color(20, 30, 20), { type: 'Triangle', point1: new Vector(0, 0), point2: new Vector(10, -10), point3: new Vector(-10, -10) }))
        */

        Networking.client.room!.state.colliders.onAdd((collider: any, key: number) => {
            if (collider.type == "Circle") {
                engine.add(createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Circle', radius: collider.radius }))
            }
            if (collider.type == "Rectangle") {
                engine.add(createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Rectangle',  width: collider.width , height: collider.height }))
            }
        })


        Networking.client.room!.state.players.onAdd((playerState: Player, id: string) => {
            if (Networking.client.clientId == id) {
                LocalPlayerInstance = new LocalPlayer(0, 300); // add local player
                this.add(LocalPlayerInstance)
            } else {
                let ent = createOtherPlayerEntity(playerState, id);
                PlayerEntities.set(id, ent)
                this.add(ent)
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

    public onDeactivate(context: SceneActivationContext): void {
        this.hudElement.style.display = "none";
    }



}
