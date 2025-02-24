import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class Tank extends Upgrade {
    constructor() {
        super("Tank", 1)
    }
}