import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class Speed extends Upgrade {
    constructor() {
        super("Speed", 3)
    }
}