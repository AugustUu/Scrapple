import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Pistol extends Gun {

    constructor(){
        super("pistol", 30, 0.3, 1, 6, 0, 1, false, 13, 8)
    }
}