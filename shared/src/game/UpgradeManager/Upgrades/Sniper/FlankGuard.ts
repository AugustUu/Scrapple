import { Bullet, State, Player } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Scope extends Upgrade {
    constructor() {
        super("Flank Guard", 1, null, "Sniper", "As seen in Diep.io")
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        let newAngle = bullet.angle + (Math.PI)

        state.bullets.set(createRandomString(16), new Bullet(player.position.x, player.position.y, newAngle, player.gun.bulletSize, player.id, player.gun.bulletSpeedMultiplier, bullet.homeRadius, bullet.homeStrength))
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