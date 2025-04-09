import { Gun } from "../Gun";
import { registerGun } from "../GunManager";

@registerGun
export class Rifle extends Gun {

    constructor(){
        super("rifle", 10, 0.2, 2, 15, 3, 1, true, 15, 4)
    }
}