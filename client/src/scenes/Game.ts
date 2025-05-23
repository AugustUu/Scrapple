import { Actor, Color, Entity, Scene, Vector, vec, SceneActivationContext, GraphicsComponent, Circle, TransformComponent, CircleColliderOptions } from "excalibur";
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
import { initStages, stageList } from "../../../shared/src/game/Stage";
import { EndGameScreen } from "./EndGameScreen";

export var PlayerEntities: Map<String, Entity<OtherPlayerComponent>> = new Map();
export var BulletEntities: Map<String, Entity<BulletComponent>> = new Map();
export var ColliderList: Array<Entity> = new Array();
export var loadingColliderList: Array<Collider> = new Array();
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
        initStages()

        const circle = new Entity({
            name: "circle",
        });


        let graphics = new GraphicsComponent();
        graphics.use(new Circle({ radius: 2000, color: Color.fromRGB(157, 174, 201) }));
        circle.addComponent(graphics)
        circle.addComponent(new TransformComponent())
        this.engine.currentScene.add(circle)

        setInterval(()=>{


            let radius =  2000 - ((Date.now() - Networking.client.room.state.game.roundStartTime)/5)/15.625;


            (circle.get(GraphicsComponent).current as Circle).radius = radius;
        },1)


        Networking.client.room!.onMessage(S2CPackets.EndGame,({winner})=>{
            document.getElementById("RoundWinner").innerText = "Winner: " + winner
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

        Networking.client.room!.onMessage(S2CPackets.WinGame,(message)=>{
            document.getElementById('whoWon').innerText = message.id
            engine.goToScene("endGameScreen")
        })

        Networking.client.room!.state.players.onAdd((playerState: Player, id: string) => {
            let spawnPosList = stageList.get(Networking.client.room!.state.game.stage).spawnPosList
            let spawnPos = spawnPosList[Math.floor(Math.random() * spawnPosList.length)]


            if (Networking.client.clientId == id) {
                Hud.initNetwork()
                LocalPlayerInstance = new LocalPlayer(spawnPos.x, spawnPos.y); // add local player
                //console.log("added new player")
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
            //console.log("killed")
            if(LocalPlayerInstance){
                if(LocalPlayerInstance.line){
                    LocalPlayerInstance.line.kill()
                }
                LocalPlayerInstance.healthBarEntity.kill()
                LocalPlayerInstance.kill()
            }
        })

    }

    

    public onActivate(context: SceneActivationContext<unknown>): void {
        
        
        Hud.enable()

        let newCollider
        for(let collider of ColliderList){
            //("killed " + collider)
            collider.kill()
        }
        ColliderList = new Array();
        for(let collider of loadingColliderList){
            if (collider.type == "Circle") {
                newCollider = (createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Circle', radius: (collider as CircleCollider).radius }))
            }
            if (collider.type == "Rectangle") {
                newCollider = (createGroundShape(collider.position.x, collider.position.y, new Color(50, 50, 50), { type: 'Rectangle',  halfWidth: (collider as RectangleCollider).width , halfHeight: (collider as RectangleCollider).height }))
            }
            if(newCollider != undefined){
                ColliderList.push(newCollider)
                engine.add(newCollider)
                //console.log("added " + collider.type)
            }
            else{
                debugger
            }
        }
        loadingColliderList = new Array();

        this.camera.zoom = 0.8 - (NetworkUtils.getLocalUpgrade("Scope") * 0.2)  

    }

    public onDeactivate(context: SceneActivationContext): void {
        Hud.disable()
    }



}