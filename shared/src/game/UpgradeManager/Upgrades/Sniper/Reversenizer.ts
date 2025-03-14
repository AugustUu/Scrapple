import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class Reversenizer extends Upgrade {
    constructor() {
        super("Reversenizer", 1)
    }
}