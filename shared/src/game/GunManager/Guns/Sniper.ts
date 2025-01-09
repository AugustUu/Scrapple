import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Sniper extends Gun {

    constructor(){
        super("sniper", 50, 1.5, 3, 2, 0, 1, false)
    }
}