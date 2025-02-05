import { Upgrade } from "../Upgrade"
import { registerUpgrade } from "../UpgradeManager"

@registerUpgrade
export class ReloadBurst extends Upgrade {
    constructor() {
        super("ReloadBurst", 1, {upgrade: "Speed", level: 3})
    }
}