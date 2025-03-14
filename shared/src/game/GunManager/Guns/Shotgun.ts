import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 6, 1, 2, 6, 12, 5, false, 7, 6)
    }
}