import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Regen extends Upgrade {
    constructor() {
        super("Regen", 3)
    }
}