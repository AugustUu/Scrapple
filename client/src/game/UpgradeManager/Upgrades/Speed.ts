import {Upgrade} from "./Upgrade"
import { registerUpgrade } from "./UpgradeManager"

@registerUpgrade
export class SpeedUpgrade extends Upgrade{
    constructor(){
        super("Speed")
    }
}

