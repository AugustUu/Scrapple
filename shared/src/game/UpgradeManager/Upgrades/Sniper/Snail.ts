import { Bullet, GunState, Player, State } from "../../../../../../server/src/State"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Snail extends Upgrade {
    constructor() {
        super("Snail", 1, null, "Sniper", "Slow bullets that 'never' miss")
    }

    serverOnGunConstructed(level: number, gun: GunState): void {
        gun.bulletSpeedMultiplier = 4
    }


    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        bullet.homeStrength *= 16
        bullet.homeRadius *= 10
        bullet.homeAngle = Math.PI * 2
    }
    
}