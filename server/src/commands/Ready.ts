import { Command } from "@colyseus/command";
import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { GameRoom } from "../rooms/GameRoom";
import { NetworkUtils } from "../../../client/src/networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Collider, Player, UpgradeState } from "../State";
import { S2CPackets } from "shared/src/networking/Packet";
import { Client } from "colyseus";
import { Stage, stageList } from "shared/src/game/Stage";

// code for random upgrades that nshould run every tick
export class ReadyCommand extends Command<GameRoom, { client: Client }> {

    execute({ client } = this.payload) {
        this.state.clients.get(client.sessionId).ready = !this.state.clients.get(client.sessionId).ready


        this.room.broadcast(S2CPackets.Readied)
        let allReady = true
        for(var otherClient of this.state.clients.values()){
            allReady = allReady && otherClient.ready
        }
        if(allReady){
            if(this.state.game.gameEnded){
                this.state.game.gameEnded = false;
                this.state.clients.forEach((otherClient, id) => {
                    otherClient.ready = false;
                    otherClient.wins = 0;
                })
                allReady = false;
                this.room.broadcast(S2CPackets.InitClient)
            }
            else if (!this.state.game.inRound) {
                this.state.game.inRound = true;
                this.state.game.roundStartTime = Date.now()
                
                let colliderList = new ArraySchema<Collider>
                this.state.game.stage = Array.from(stageList.keys())[Math.floor(Math.random() * Array.from(stageList.keys()).length)]
                let stage = stageList.get(this.state.game.stage)
                
                for(let collider of stage.colliderList){
                    colliderList.push(collider)
                }

                this.state.colliders = colliderList
                
                this.state.clients.forEach((otherClient, id) => {
                   
                    otherClient.ready = false
                    let pickedUpgradeID = otherClient.upgradeOptions.options[otherClient.upgradeOptions.picked]
        
                    if (Upgrades.has(pickedUpgradeID)){
                        if(otherClient.upgrades.has(pickedUpgradeID)){
                            if(otherClient.upgrades.get(pickedUpgradeID).level < Upgrades.get(pickedUpgradeID).max){
                                otherClient.upgrades.get(pickedUpgradeID).level += 1
                            }
                        }
                        else{
                            otherClient.upgrades.set(pickedUpgradeID, new UpgradeState(pickedUpgradeID)) 
                        }
                    }
                    //console.log("new player", id, otherClient.name)
                    this.state.players.set(id, new Player(otherClient.name, id, otherClient));
                })
    
                this.room.broadcast(S2CPackets.StartGame, {stage: this.state.game.stage, colliderList: colliderList})
            }
            
        }
    }

}

