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
import { S2CPackets } from "shared/src/networking/Packet";
import { Hud } from "../ui/Hud";
import { NetworkUtils } from "../networking/NetworkUtils";

export var PlayerEntities: Map<String, Entity<OtherPlayerComponent>> = new Map();
export var BulletEntities: Map<String, Entity<BulletComponent>> = new Map();
export var LocalPlayerInstance: LocalPlayer;

export class Game extends Scene {

    public onInitialize() {
        this.world.systemManager.addSystem(PhysicsSystem);
        this.world.systemManager.addSystem(PhysicsObjectRenderSystem);
        //this.world.systemManager.addSystem(PhysicsSystemDebug);
        this.world.systemManager.addSystem(GrappleLineSystem)
        this.world.systemManager.addSystem(OtherPlayerMoveSystem);
        this.world.systemManager.addSystem(BulletMoveSystem);

        this.camera.pos = Vector.Zero
        this.camera.zoom = 0.8 - (NetworkUtils.getLocalUpgrade("Scope") * 0.2)

        Hud.initMain()


        Networking.client.room!.onMessage(S2CPackets.EndGame,()=>{
            if(LocalPlayerInstance){
                if(LocalPlayerInstance.line){
                    LocalPlayerInstance.line.kill()
                }
                LocalPlayerInstance.healthBarEntity.kill()
                LocalPlayerInstance.kill()
            }
            PlayerEntities.forEach((player)=>{
                let line = player.get(OtherPlayerComponent).grappleLine
                if(line){
                    line.kill()
                }
            })

            BulletEntities.forEach((bullet)=>{
                bullet.kill()
            })
            this.engine.goToScene("endRoundScreen")
        })

        Networking.client.room!.state.colliders.onAdd((collider: any, key: number) => {
            if (collider.type == "Circle") {
                engine.add(createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Circle', radius: collider.radius }))
            }
            if (collider.type == "Rectangle") {
                engine.add(createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Rectangle',  halfWidth: collider.width , halfHeight: collider.height }))
            }
        })


        Networking.client.room!.state.players.onAdd((playerState: Player, id: string) => {
            if (Networking.client.clientId == id) {
                Hud.initNetwork()
                LocalPlayerInstance = new LocalPlayer(0, 300); // add local player
                this.add(LocalPlayerInstance)
            } else {
                let ent = createOtherPlayerEntity(playerState, id);
                PlayerEntities.set(id, ent)
                this.add(ent)
            }
        })

        Networking.client.room!.state.players.onRemove((player: any, id: string) => {
            PlayerEntities.get(id)?.get(OtherPlayerComponent).healthBar.kill()
            PlayerEntities.get(id)?.get(OtherPlayerComponent).nameTag.kill()
            PlayerEntities.get(id)?.kill()
        })

        Networking.client.room!.state.bullets.onAdd((bullet: Bullet, id: string) => {
            let bulletEntity = createBullet(bullet, id)
            BulletEntities.set(id, bulletEntity)
            this.add(bulletEntity)
        })

        Networking.client.room!.state.bullets.onRemove((bullet: any, id: string) => {
            BulletEntities.get(id)?.kill()
        })

        Networking.client.room.onMessage(S2CPackets.Killed,()=>{
            console.log("killed")
            if(LocalPlayerInstance){
                LocalPlayerInstance.kill()
            }
        })

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        Hud.enable()

        this.camera.zoom = 0.8 - (NetworkUtils.getLocalUpgrade("Scope") * 0.2)  

    }

    public onDeactivate(context: SceneActivationContext): void {
        Hud.disable()
    }



}
