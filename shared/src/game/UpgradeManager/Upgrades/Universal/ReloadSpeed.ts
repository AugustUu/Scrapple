import { GunState } from "../../../../../../server/src/State";
import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class ReloadSpeed extends Upgrade {
    constructor() {
        super("Reload Speed", 5,null,null,"Reload speedier")
    }

    serverOnGunConstructed(level: number, gun: GunState) {
        gun.reloadDelay -= gun.reloadDelay * 0.3 * level;
    }
}