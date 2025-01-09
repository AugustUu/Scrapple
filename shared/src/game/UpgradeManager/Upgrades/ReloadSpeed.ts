import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class ReloadSpeed extends Upgrade {
    constructor() {
        super("ReloadSpeed", 5)
    }
}