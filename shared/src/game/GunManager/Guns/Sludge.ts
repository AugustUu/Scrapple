import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Sludge extends Gun {

    constructor(){
        super("sludge", 3, 0.05, 3, 1, 30, 30, true, 30, 8)
    }
}