import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";


// code for random upgrades that nshould run every tick
export class UpgradeTickCommand extends Command<GameRoom, {}> {

    execute({ } = this.payload) {
        this.state.players.forEach((player) => {
            let client = this.state.clients.get(player.id)

            if(player.health < player.maxHealth && client.getUpgradeLevel("Regen")){
                player.health += (client.getUpgradeLevel("Regen") * 0.015625 * 5)
            }
        })
    }

}


