import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Sniper extends Gun {

    constructor(){
        super("sniper", 50, 1, 3, 4, 0, 1, false, 50, 8)
    }
}