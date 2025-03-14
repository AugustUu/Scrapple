import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GrappleCooldown extends Upgrade {
    constructor() {
        super("GrappleCooldown", 3)
    }
}