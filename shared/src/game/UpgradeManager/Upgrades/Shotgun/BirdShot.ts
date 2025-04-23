import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class BirdShot extends Upgrade {
    constructor() {
        super("Birdshot", 1, null, "Shotgun")
    }
}