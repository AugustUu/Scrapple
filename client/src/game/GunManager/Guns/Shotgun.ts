import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 20, 1, 3, 6, 20, 5, false)
    }
}