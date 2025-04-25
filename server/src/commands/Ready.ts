import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { NetworkUtils } from "../../../client/src/networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Player, UpgradeState } from "../State";
import { S2CPackets } from "shared/src/networking/Packet";
import { Client } from "colyseus";

// code for random upgrades that nshould run every tick
export class ReadyCommand extends Command<GameRoom, { client: Client }> {

    execute({ client } = this.payload) {
        this.state.clients.get(client.sessionId).ready = !this.state.clients.get(client.sessionId).ready

        console.log(this.state.clients.get(client.sessionId).ready)
        this.room.broadcast(S2CPackets.Readied)
        let allReady = true
        for(var otherClient of this.state.clients.values()){
            allReady = allReady && otherClient.ready
        }
        if(allReady){
            if (!this.state.game.inRound) {
                this.state.game.inRound = true;
                this.state.game.roundStartTime = Date.now()
    
                this.state.clients.forEach((otherClient, id) => {
                   
                    otherClient.ready = false
                    let pickedUpgradeID = otherClient.upgradeOptions.options[otherClient.upgradeOptions.picked]
    
                    console.log("GOT UPGRADE",this.state.clients.get(id).upgradeOptions.options[otherClient.upgradeOptions.picked])
    
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
    
                    this.state.players.set(id, new Player(otherClient.name, id, otherClient));
                })
    
                this.room.broadcast(S2CPackets.StartGame)
            }
            
        }
    }

}


