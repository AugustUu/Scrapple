import { Room, Client } from "@colyseus/core";

import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"

import { State, Bullet, Player, GunState, CircleCollider, RectangleCollider, PlayerClient, UpgradeState, TriangleCollider, Position } from "../State"
import { Guns, idList } from "shared/src/game/GunManager/GunManager";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand } from "../commands/OnJoin";
import { OnLeaveCommand } from "../commands/OnLeave";
import { BulletTickCommand } from "../commands/BulletTick";
import { ShootCommand } from "../commands/ShootBullet";
import { ReadyCommand } from "../commands/Ready";
import { ReloadCommand } from "../commands/Reload";
import { MoveCommand } from "../commands/Move";
import { EndGrappleCommand, StartGrappleCommand } from "../commands/Grapple";
import { EndGameCommand } from "../commands/EndGame";
import { UpgradeTickCommand } from "../commands/UpgradeTick";
import { initStages, Stage, stageList } from "shared/src/game/Stage";





export class GameRoom extends Room<State> {
    maxClients = 8;
    dispatcher = new Dispatcher(this);



    onCreate(options: any) {
        this.setState(new State());
        this.setPatchRate(15.625)

        this.state.game.inRound = false;

        initStages()

        this.onMessage(C2SPacket.Ping, (client, message) => {
            client.send(S2CPackets.Pong, {})
        })

        this.onMessage(C2SPacket.Ready, (client, message) => {
            this.dispatcher.dispatch(new ReadyCommand(), { client: client });
        })

        this.onMessage(C2SPacket.PickGun, (client, message) => {
            if(message < 3  && message > -1){
                this.state.clients.get(client.id).gunOptions.picked = message;
            }
        })

        this.onMessage(C2SPacket.PickUpgrade, (client, message) => {
            if(message < 3 && message > -1){
                this.state.clients.get(client.id).upgradeOptions.picked = message;
                
            }
        })

        this.onMessage(C2SPacket.Move, (client, message) => {
            this.dispatcher.dispatch(new MoveCommand(), {
                client: client,
                message: message
            });
        })

        this.onMessage(C2SPacket.Shoot, (client, message) => {
            this.dispatcher.dispatch(new ShootCommand(), {
                client: client,
                message: message
            });


        })

        this.onMessage(C2SPacket.Reload, (client, message) => {

            this.dispatcher.dispatch(new ReloadCommand(), {
                client: client,
            });


        })

        this.onMessage(C2SPacket.Grapple, (client, message) => {
            this.dispatcher.dispatch(new StartGrappleCommand(), {
                client: client,
                message: message
            });
        })

        this.onMessage(C2SPacket.EndGrapple, (client, message) => {

            this.dispatcher.dispatch(new EndGrappleCommand(), {
                client: client,
                message: message
            });


        })



        // debug code 
        this.onMessage(C2SPacket.SwapGun, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            if (Guns.has(message.id)) {
                //player.gun = new GunState(message.id);
            }
        })

        this.onMessage(C2SPacket.LevelUpgrade, (client, message) => {
            let playerClient = this.state.clients.get(client.sessionId)
            if (Upgrades.has(message.id)) {
                if (playerClient.upgrades.has(message.id)) {
                    if (playerClient.upgrades.get(message.id).level < Upgrades.get(message.id).max) {
                        playerClient.upgrades.get(message.id).level += 1
                    }
                }
                else {
                    playerClient.upgrades.set(message.id, new UpgradeState(message.id))
                }
            }
        })


    }

    onBeforePatch() {

        this.dispatcher.dispatch(new BulletTickCommand(), {});
        this.dispatcher.dispatch(new UpgradeTickCommand(), {})

        if (this.state.players.size == 1 && this.state.game.inRound) {

            this.dispatcher.dispatch(new EndGameCommand(), {});

        }

    }


    onJoin(client: Client, options: any) {

        this.dispatcher.dispatch(new OnJoinCommand(), {
            client: client,
            options: options
        });


    }

    onLeave(client: Client, consented: boolean) {

        this.dispatcher.dispatch(new OnLeaveCommand(), {
            client: client,
        });


    }

    onDispose() {
        //console.log("room", this.roomId, "disposing...");
    }


}
