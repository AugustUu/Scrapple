import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { NetworkUtils } from "../../../client/src/networking/NetworkUtils";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Player, UpgradeState } from "../State";
import { S2CPackets } from "shared/src/networking/Packet";

// code for random upgrades that nshould run every tick
export class ReadyCommand extends Command<GameRoom, {}> {

    execute({} = this.payload) {
        //NetworkUtils.getLocalClient().ready = !NetworkUtils.getLocalClient().ready BROKEN BUT IS THE MAIN PURPOSE OF THIS FILE
        let allReady = true
        for(var client of this.state.clients.values()){
            allReady = allReady && !client.ready
        }
        if(allReady){
            if (!this.state.game.inRound) {
                this.state.game.inRound = true;
    
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


