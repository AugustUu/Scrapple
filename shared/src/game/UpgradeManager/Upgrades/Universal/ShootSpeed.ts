import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class ShootSpeed extends Upgrade {
    constructor() {
        super("ShootSpeed", 5)
    }
}