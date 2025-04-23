import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class ReloadBurst extends Upgrade {
    constructor() {
        super("Reload Burst", 1,null,"Shotgun", "Only on an empty magazine.")
    }
}