import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Pistol extends Gun {

    constructor(){
        super("pistol", 20, 0.5, 1, 6, 0, 1, false)
    }
}