import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class OneForAll extends Upgrade {
    constructor() {
        super("OneForAll", 1)
    }
}