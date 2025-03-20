import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class GlassCannon extends Upgrade {
    constructor() {
        super("GlassCannon", 3, null, "Pistol")
    }
}