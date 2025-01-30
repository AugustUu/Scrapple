import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 20, 1, 2, 6, 12, 5, false, 7)
    }
}