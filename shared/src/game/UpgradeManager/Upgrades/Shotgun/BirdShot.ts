import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class BirdShot extends Upgrade {
    constructor() {
        super("Bird Shot", 1, null, "Shotgun", "If your bullets are smaller you can pack more in a shell (UNIMPLEMENTED)")
    }
}