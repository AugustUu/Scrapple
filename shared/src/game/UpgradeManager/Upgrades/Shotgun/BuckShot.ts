import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class BuckShot extends Upgrade {
    constructor() {
        super("Buck Shot", 1, null, "Shotgun", "Larger bullets means you can only fit so many in one shell (UNIMPLEMENTED)")
    }
}