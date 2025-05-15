import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Bonk extends Upgrade {
    constructor() {
        super("Bonk", 3, null, "Pistol", "Damage players by rolling into them")
    }

    serverOnPlayerConstructed(level: number, player: Player): void {
        player.radius *= 1.1 * level
    }

    serverOnServerTick(level: number, state: State, player: Player): void {
        state.players.forEach((otherPlayer: Player) => {
            if(player.id != otherPlayer.id){
                if (Math.hypot(player.position.x - otherPlayer.position.x, player.position.y - otherPlayer.position.y) <= (otherPlayer.radius + player.radius)) {
                    otherPlayer.health -= 28/64 * level
                }
            }
        })
    }
}