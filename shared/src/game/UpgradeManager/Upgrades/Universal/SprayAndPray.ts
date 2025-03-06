import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SprayAndPray extends Upgrade {
    constructor() {
        super("SprayAndPray", 3)
    }
}