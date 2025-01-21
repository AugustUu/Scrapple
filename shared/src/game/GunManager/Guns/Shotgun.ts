import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 20, 0.8, 3, 6, 15, 5, false, 5)
    }
}