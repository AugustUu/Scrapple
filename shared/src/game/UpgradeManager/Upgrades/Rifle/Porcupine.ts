import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { Bullet, GunState, Player, State } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Porcupine extends Upgrade {
    constructor() {
        super("Porcupine", 3, null, "Rifle")
    }
    
    serverOnPlayerHit(level: number, state: State, player: Player , otherPlayer: Player): void {

        let angle = Math.atan2(otherPlayer.position.y - player.position.y, otherPlayer.position.x - player.position.x)

        for(let i=0; i<level; i++){
            state.bullets.set(createRandomString(16), new Bullet(player.position.x, player.position.y, angle, 5, player.id, 6, 4, 0.05))
        }
    }

    
}

function createRandomString(length:number) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  