import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { Player, UpgradeState } from "../State";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";



export class StartGameCommand extends Command<GameRoom, { client: Client}> {

    execute({ client } = this.payload) {

        if (this.state.clients.get(client.id).ready && !this.state.game.inRound) {
            this.state.game.inRound = true;

            this.state.clients.forEach((otherClient, id) => {
               
                
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