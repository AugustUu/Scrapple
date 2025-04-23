import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class BuckShot extends Upgrade {
    constructor() {
        super("Buckshot", 1, null, "Shotgun")
    }
}