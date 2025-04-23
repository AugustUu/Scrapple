import { Upgrade } from "../../Upgrade"
import { registerUpgrade } from "../../UpgradeManager"

@registerUpgrade
export class SawedOff extends Upgrade {
    constructor() {
        super("SawedOff", 1,null,"Shotgun", "UNIMPLEMENTED")
    }
}