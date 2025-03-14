import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class AntsInYoPants extends Upgrade {
    constructor() {
        super("AntsInYoPants", 1)
    }
}