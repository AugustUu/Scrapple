import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 8, 1, 1.5, 6, 12, 5, false, 10, 6)
    }
}