import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Minigun extends Gun {

    constructor(){
        super("minigun", 3, 0.05, 3, 50, 10, 1, true, 13, 4)
    }
}