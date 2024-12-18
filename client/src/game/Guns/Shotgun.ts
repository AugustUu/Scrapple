import { Gun } from "./Gun";

export class Shotgun extends Gun {

    constructor(){
        super("shotgun", 20, 1, 3, 6, 20, 8, false)
    }
}