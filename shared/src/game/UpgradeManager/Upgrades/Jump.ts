import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class Jump extends Upgrade {
    constructor() {
        super("Jump")
    }
}