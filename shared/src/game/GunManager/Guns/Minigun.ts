import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Minigun extends Gun {

    constructor(){
        super("minigun", 1, 0.1, 3, 80, 1, 1, true, 10)
    }
}