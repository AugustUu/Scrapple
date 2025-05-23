import { LocalPlayer } from "../../../../../../client/src/game/LocalPlayer";
import { GunState, Player } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SuperCharge extends Upgrade {
    constructor() {
        super("Laser", 1, null, "Minigun", "Halves the magazine but turns your gun into a laser")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.spread = 0;
        gun.damage *= 0.9
    }

}