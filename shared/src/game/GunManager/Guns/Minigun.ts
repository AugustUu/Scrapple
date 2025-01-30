import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Minigun extends Gun {

    constructor(){
        super("minigun", 3, 0.1, 3, 50, 1, 4, true, 20)
    }
}