import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class HighVelocity extends Upgrade {
    constructor() {
        super("HighVelocity", 3)
    }
}