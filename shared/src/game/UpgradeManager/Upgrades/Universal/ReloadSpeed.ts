import { GunState } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class ReloadSpeed extends Upgrade {
    constructor() {
        super("ReloadSpeed", 5,null,null,"Reload speedier")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.reloadDelay -= 500 * level;
    }
}