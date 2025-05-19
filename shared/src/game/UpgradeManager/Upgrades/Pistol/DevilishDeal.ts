import { Bullet, GunState, State, Player } from "../../../../../../server/src/State"
import { Pistol } from "../../../GunManager/Guns/Pistol"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Scope extends Upgrade {
    constructor() {
        super("Devilish Deal", 1, null, "Pistol", "Shooting hurts you, and taking damage heals the one who shot you. In return, your damage is doubled.")
    }


    serverOnGunConstructed(level: number, gun: GunState) {
        gun.damage *= 2
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player): void {
        player.health -= player.gun.damage * 0.1
    }

    serverOnPlayerHit(level: number, state: State, player: Player, otherPlayer: Player) {
        otherPlayer.health += otherPlayer.gun.damage
    }
}