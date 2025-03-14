import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class BirdShot extends Upgrade {
    constructor() {
        super("BirdShot", 1,null,"Shotgun")
    }
}