import { Player, State } from "../../../../../../server/src/State"
import { Gun } from "../../../GunManager/Gun"
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Regen extends Upgrade {
    constructor() {
        super("Regen", 3)
    }

    serverOnPlayerConstructed(level: number, player: Player): void {
        player.health -= player.maxHealth/1.5;
    }

    serverOnServerTick(level: number, state: State, player: Player): void {
        if (player.health < player.maxHealth) {
            player.health += (level * 0.015625 * 5)
        }
    }
}