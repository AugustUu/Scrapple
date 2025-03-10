import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class JumpBoost extends Upgrade {
    constructor() {
        super("JumpBoost", 3)
    }
}