import { Gun } from "./Gun";

export class Pistol extends Gun {

    constructor(){
        super("pistol", 20, 0.5, 2, 6, 0, 1, false)
    }
}