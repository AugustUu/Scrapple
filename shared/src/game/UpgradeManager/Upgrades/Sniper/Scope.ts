import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Scope extends Upgrade {
    constructor() {
        super("Scope", 1,null,"Sniper")
    }
}